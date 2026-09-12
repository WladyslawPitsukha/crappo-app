import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormMining from "@/utils/FormMining";

describe("mining subscription form", () => {
    afterEach(() => {
        cleanup();
    });

    it("shows an error for an empty email submission", () => {
        const { container } = render(<FormMining />);

        fireEvent.submit(container.querySelector("form")!);

        expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address.");
    });

    it("shows an error for an invalid email submission", () => {
        const user = userEvent.setup();
        render(<FormMining />);

        const emailInput = screen.getByPlaceholderText("Enter your email");
        return user.type(emailInput, "not-an-email").then(() => {
            fireEvent.submit(emailInput.closest("form")!);
            expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address.");
        });
    });

    it("confirms a valid subscription and clears the input", async () => {
        const user = userEvent.setup();
        render(<FormMining />);

        const emailInput = screen.getByPlaceholderText("Enter your email");
        await user.type(emailInput, "miner@example.com");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(screen.getByRole("status")).toHaveTextContent("Thanks, you are on the list.");
        expect(emailInput).toHaveValue("");
    });

    it("clears the previous message when the email is edited", async () => {
        const user = userEvent.setup();
        render(<FormMining />);

        const emailInput = screen.getByPlaceholderText("Enter your email");
        await user.type(emailInput, "miner@example.com");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));
        expect(screen.getByRole("status")).toBeInTheDocument();

        await user.type(emailInput, "next@example.com");

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});
