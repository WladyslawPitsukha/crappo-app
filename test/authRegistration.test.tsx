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

describe("registration validation", () => {
    beforeEach(() => {
        mockLogin.mockReset();
        mockRegister.mockReset();
        mockPush.mockReset();
    });

    afterEach(() => {
        cleanup();
    });

    it("rejects passwords shorter than eight characters", async () => {
        const user = userEvent.setup();
        render(<AuthForm mode="register" />);

        await user.type(screen.getByLabelText("Email"), "new-user@example.com");
        await user.type(screen.getByLabelText("Password"), "short");
        await user.click(screen.getByRole("button", { name: "Register" }));

        expect(screen.getByRole("alert")).toHaveTextContent("Password must contain at least 8 characters.");
        expect(mockRegister).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it("shows the duplicate-account error", async () => {
        const user = userEvent.setup();
        mockRegister.mockReturnValue("An account with this email already exists.");
        render(<AuthForm mode="register" />);

        await user.type(screen.getByLabelText("Email"), "existing@example.com");
        await user.type(screen.getByLabelText("Password"), "validpass");
        await user.click(screen.getByRole("button", { name: "Register" }));

        expect(mockRegister).toHaveBeenCalledWith("existing@example.com", "validpass");
        expect(screen.getByRole("alert")).toHaveTextContent("An account with this email already exists.");
        expect(mockPush).not.toHaveBeenCalled();
    });

    it("registers a valid account and navigates to the dashboard", async () => {
        const user = userEvent.setup();
        mockRegister.mockReturnValue(null);
        render(<AuthForm mode="register" />);

        await user.type(screen.getByLabelText("Email"), "New-User@Example.COM");
        await user.type(screen.getByLabelText("Password"), "validpass");
        await user.click(screen.getByRole("button", { name: "Register" }));

        expect(mockRegister).toHaveBeenCalledWith("New-User@Example.COM", "validpass");
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("requires an email address before submitting", async () => {
        const user = userEvent.setup();
        render(<AuthForm mode="register" />);

        await user.type(screen.getByLabelText("Password"), "validpass");
        await user.click(screen.getByRole("button", { name: "Register" }));

        expect(mockRegister).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });
});
