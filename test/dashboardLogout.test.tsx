import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { mockLogout, mockPush, mockReplace } = vi.hoisted(() => ({
    mockLogout: vi.fn(),
    mockPush: vi.fn(),
    mockReplace: vi.fn(),
}));

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

describe("dashboard logout", () => {
    beforeEach(() => {
        mockLogout.mockReset();
        mockPush.mockReset();
        mockReplace.mockReset();
    });

    afterEach(() => {
        cleanup();
    });

    it("logs out and navigates home", async () => {
        const user = userEvent.setup();
        render(<DashboardPage />);

        await user.click(screen.getByRole("button", { name: "Logout" }));

        expect(mockLogout).toHaveBeenCalledOnce();
        expect(mockPush).toHaveBeenCalledWith("/");
    });
});
