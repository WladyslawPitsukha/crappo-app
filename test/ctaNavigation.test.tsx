import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const { mockLogout, mockUseAuth } = vi.hoisted(() => ({
    mockLogout: vi.fn(),
    mockUseAuth: vi.fn(),
}));

vi.mock("next/link", () => ({
    default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a {...props}>{children}</a>
    ),
}));

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />, 
}));

vi.mock("@/components/auth/AuthProvider", () => ({
    useAuth: () => mockUseAuth(),
}));

import Header from "@/components/header";
import NavBar from "@/components/navBar";

describe("cta navigation", () => {
    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            logout: mockLogout,
            user: null,
        });
    });

    afterEach(() => {
        cleanup();
        mockLogout.mockReset();
        mockUseAuth.mockReset();
    });

    it("routes the main header CTA to the registration page", () => {
        render(<Header />);

        expect(screen.getByRole("link", { name: /try for free/i })).toHaveAttribute("href", "/register");
    });

    it("shows the guest actions for logging in and registering", () => {
        render(<NavBar />);

        expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("href", "/login");
        expect(screen.getByRole("link", { name: /register/i })).toHaveAttribute("href", "/register");
    });

    it("shows the dashboard action for authenticated users", () => {
        mockUseAuth.mockReturnValue({
            logout: mockLogout,
            user: { email: "user@example.com" },
        });

        render(<NavBar />);

        expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard");
    });
});
