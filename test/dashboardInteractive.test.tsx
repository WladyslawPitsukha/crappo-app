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

        expect(screen.getByRole("button", { name: "Overview" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Performance" })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Performance" }));

        expect(screen.getAllByText(/weekly pnl/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/24h volume/i).length).toBeGreaterThan(0);
    });

    it("records a buy and persists the updated holding for the signed-in user", async () => {
        const user = userEvent.setup();
        render(<DashboardPage />);

        await waitFor(() => expect(screen.getByRole("button", { name: "Buy asset" })).not.toBeDisabled());
        await user.type(screen.getByPlaceholderText("0.00"), "0.5");
        await user.click(screen.getByRole("button", { name: "Buy asset" }));

        expect(screen.getByText(/0.5 BTC for/i)).toBeInTheDocument();
        expect(localStorage.getItem("crappo-portfolio-user@example.com")).toContain('"quantity":0.5');
    });
});
