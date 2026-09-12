import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
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

import DashboardPage from "@/app/dashboard/page";

describe("dashboard interactive widgets", () => {
    afterEach(() => {
        cleanup();
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
});
