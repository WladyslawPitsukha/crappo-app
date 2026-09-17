import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockLogout = vi.fn();

vi.mock("next/link", () => ({
    default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a {...props}>{children}</a>
    ),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
    useAuth: () => ({
        isReady: true,
        user: { email: "user@example.com" },
        logout: mockLogout,
    }),
}));

vi.mock("@/utils/coinGecko", () => ({
    CoinGeckoError: class extends Error {},
    getCoinMarketData: vi.fn().mockResolvedValue({
        bitcoin: { price: 70000, change24h: 3.4, volume24h: 1000000000 },
        ethereum: { price: 2500, change24h: 1.8, volume24h: 500000000 },
        litecoin: { price: 70, change24h: -0.8, volume24h: 100000000 },
    }),
}));

import DashboardPage from "@/app/dashboard/page";

describe("dashboard interactive widgets", () => {
    afterEach(() => {
        cleanup();
        localStorage.clear();
        mockPush.mockReset();
        mockReplace.mockReset();
        mockLogout.mockReset();
    });

    it("renders dashboard tabs and updates the content when switching views", async () => {
        const user = userEvent.setup();
        render(<DashboardPage />);

        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(screen.getByText("Performance")).toBeInTheDocument();

        await user.click(screen.getByText("Performance"));

        expect(screen.getAllByText(/weekly pnl/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/24h volume/i).length).toBeGreaterThan(0);
    });

    it("renders persisted portfolio activity from the user data instead of static demo feed", async () => {
        localStorage.setItem("crappo-portfolio-user@example.com", JSON.stringify({
            holdings: {
                bitcoin: { quantity: 0.5, averageCost: 62000 },
            },
            transactions: [{
                id: "tx-1",
                type: "buy",
                symbol: "BTC",
                quantity: 0.5,
                price: 70000,
                total: 35000,
                createdAt: new Date().toISOString(),
            }],
        }));

        render(<DashboardPage />);

        await waitFor(() => expect(screen.getByText(/recent activity/i)).toBeInTheDocument());
        expect(screen.getAllByText(/0.5 BTC/i).length).toBeGreaterThan(0);
        expect(screen.queryByText(/Stake/i)).not.toBeInTheDocument();
    });

    it("lets a signed-in user add a coin to the watchlist from the dashboard", async () => {
        const user = userEvent.setup();
        render(<DashboardPage />);

        await waitFor(() => expect(screen.getByText("Watchlist")).toBeInTheDocument());
        await user.click(screen.getByRole("button", { name: /add bitcoin to watchlist/i }));

        expect(screen.getByText(/bitcoin is in your watchlist/i)).toBeInTheDocument();
    });

    it("filters watchlist assets and opens transaction details", async () => {
        const user = userEvent.setup();
        localStorage.setItem("crappo-portfolio-user@example.com", JSON.stringify({
            holdings: {},
            transactions: [{
                id: "tx-detail",
                type: "buy",
                symbol: "BTC",
                quantity: 0.25,
                price: 70000,
                total: 17500,
                createdAt: new Date().toISOString(),
            }],
        }));

        render(<DashboardPage />);
        await user.type(screen.getByRole("textbox", { name: "Search watchlist assets" }), "lite");
        expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
        expect(screen.getByText("Litecoin")).toBeInTheDocument();
        await user.click(screen.getAllByText(/0.25 BTC for/i)[0]);
        expect(screen.getByRole("dialog")).toHaveTextContent(/transaction details/i);
    });

    it("shows transaction history and analytics from persisted portfolio activity", async () => {
        localStorage.setItem("crappo-portfolio-user@example.com", JSON.stringify({
            holdings: {
                bitcoin: { quantity: 0.5, averageCost: 62000 },
            },
            transactions: [{
                id: "tx-1",
                type: "buy",
                symbol: "BTC",
                quantity: 0.5,
                price: 70000,
                total: 35000,
                createdAt: new Date().toISOString(),
            }],
        }));

        render(<DashboardPage />);

        await waitFor(() => expect(screen.getByText(/transaction history/i)).toBeInTheDocument());
        expect(screen.getByText(/total trade volume/i)).toBeInTheDocument();
        expect(screen.getAllByText(/buy/i).length).toBeGreaterThan(0);
    });

    it("records a buy and persists the updated holding for the signed-in user", async () => {
        const user = userEvent.setup();
        render(<DashboardPage />);

        await waitFor(() => expect(screen.getByText("Buy asset")).toBeInTheDocument());
        await user.type(screen.getByPlaceholderText("0.00"), "0.5");
        await user.click(screen.getByText("Buy asset"));
        expect(screen.getByRole("dialog")).toHaveTextContent(/confirm buy/i);
        await user.click(screen.getByText("Confirm trade"));

        expect(screen.getAllByText(/0.5 BTC for/i).length).toBeGreaterThan(0);
        expect(localStorage.getItem("crappo-portfolio-user@example.com")).toContain('"quantity":0.5');
    });
});
