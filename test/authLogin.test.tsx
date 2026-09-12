import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { mockLogin, mockRegister, mockPush } = vi.hoisted(() => ({
    mockLogin: vi.fn(),
    mockRegister: vi.fn(),
    mockPush: vi.fn(),
}));

vi.mock("next/link", () => ({
    default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a {...props}>{children}</a>
    ),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
    useAuth: () => ({
        login: mockLogin,
        register: mockRegister,
    }),
}));

import AuthForm from "@/components/auth/AuthForm";

describe("login validation", () => {
    beforeEach(() => {
        localStorage.clear();
        mockLogin.mockReset();
        mockRegister.mockReset();
        mockPush.mockReset();
    });

    afterEach(() => {
        cleanup();
    });

    it("rejects passwords shorter than eight characters", async () => {
        const user = userEvent.setup();
        render(<AuthForm mode="login" />);

        await user.type(screen.getByLabelText("Email"), "user@example.com");
        await user.type(screen.getByLabelText("Password"), "short");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(screen.getByRole("alert")).toHaveTextContent("Password must contain at least 8 characters.");
        expect(mockLogin).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it("shows the auth error when credentials are rejected", async () => {
        const user = userEvent.setup();
        mockLogin.mockReturnValue("Incorrect email or password.");
        render(<AuthForm mode="login" />);

        await user.type(screen.getByLabelText("Email"), "user@example.com");
        await user.type(screen.getByLabelText("Password"), "wrongpass");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(mockLogin).toHaveBeenCalledWith("user@example.com", "wrongpass");
        expect(screen.getByRole("alert")).toHaveTextContent("Incorrect email or password.");
        expect(mockPush).not.toHaveBeenCalled();
    });

    it("navigates to the dashboard after valid login", async () => {
        const user = userEvent.setup();
        mockLogin.mockReturnValue(null);
        render(<AuthForm mode="login" />);

        await user.type(screen.getByLabelText("Email"), "user@example.com");
        await user.type(screen.getByLabelText("Password"), "correctpass");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(mockLogin).toHaveBeenCalledWith("user@example.com", "correctpass");
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("requires an email address before submitting", async () => {
        const user = userEvent.setup();
        render(<AuthForm mode="login" />);

        await user.type(screen.getByLabelText("Password"), "correctpass");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(mockLogin).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it("accepts the default demo credentials when no saved users exist", async () => {
        const user = userEvent.setup();
        render(<AuthForm mode="login" />);

        await user.type(screen.getByLabelText("Email"), "user@example.com");
        await user.type(screen.getByLabelText("Password"), "password123");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
});
