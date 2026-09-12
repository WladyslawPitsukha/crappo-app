import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";

function AuthState() {
    const { isReady, user, logout } = useAuth();

    if (!isReady) {
        return <p>Loading</p>;
    }

    return (
        <>
            <p>{user ? `Signed in as ${user.email}` : "Signed out"}</p>
            {user && <button onClick={logout} type="button">Logout</button>}
        </>
    );
}

describe("logout behavior", () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("crappo-demo-session", JSON.stringify({ email: "user@example.com" }));
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
    });

    it("restores the stored session and clears it on logout", async () => {
        const user = userEvent.setup();
        render(
            <AuthProvider>
                <AuthState />
            </AuthProvider>,
        );

        expect(await screen.findByText("Signed in as user@example.com")).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Logout" }));

        expect(screen.getByText("Signed out")).toBeInTheDocument();
        expect(localStorage.getItem("crappo-demo-session")).toBeNull();
        expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
    });
});
