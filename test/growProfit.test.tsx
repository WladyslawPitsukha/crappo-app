import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

class MockCoinGeckoError extends Error {
    constructor(message: string, public kind: "request" | "rate-limit" | "timeout" = "request") {
        super(message);
        this.name = "CoinGeckoError";
    }
}

const { mockGetCoinMarketData, mockError } = vi.hoisted(() => {
    class CoinGeckoError extends Error {
        constructor(message: string, public kind: "request" | "rate-limit" | "timeout" = "request") {
            super(message);
            this.name = "CoinGeckoError";
        }
    }
    return {
        mockGetCoinMarketData: vi.fn(),
        mockError: CoinGeckoError,
    };
});

vi.mock("@/utils/coinGecko", () => ({
    getCoinMarketData: mockGetCoinMarketData,
    CoinGeckoError: mockError,
}));

// Import after mocking so the mock is used
import GrowProfit from "@/components/growProfit";

const marketData = {
    bitcoin: { price: 62000, change24h: 2.5, volume24h: 1000000 },
    ethereum: { price: 3000, change24h: -1.2, volume24h: 500000 },
    litecoin: { price: 80, change24h: 0.4, volume24h: 100000 },
};

describe("GrowProfit market table", () => {
    beforeEach(() => {
        mockGetCoinMarketData.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    it("shows loading state initially", () => {
        mockGetCoinMarketData.mockImplementation(() => new Promise(() => {
            /* never resolves */
        }));

        render(<GrowProfit />);

        expect(screen.getByRole("status")).toHaveTextContent("Loading live market data...");
    });

    it("renders market data after successful load", async () => {
        mockGetCoinMarketData.mockResolvedValue(marketData);

        render(<GrowProfit />);

        await waitFor(() => {
            expect(screen.getByText("Bitcoin")).toBeInTheDocument();
        });

        expect(screen.getByText("Ethereum")).toBeInTheDocument();
        expect(screen.getByText("Litecoin")).toBeInTheDocument();
        expect(screen.getByText("$62,000.00")).toBeInTheDocument();
    });

    it("shows error message and retry button on API failure", async () => {
        const error = new mockError("Unable to load market data. Please try again.");
        mockGetCoinMarketData.mockRejectedValue(error);

        render(<GrowProfit />);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });
        expect(screen.getByRole("alert")).toHaveTextContent("Unable to load market data. Please try again.");
        expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
    });

    it("shows rate-limit message on rate-limit error", async () => {
        const error = new mockError(
            "CoinGecko is rate limiting requests. Please try again shortly.",
            "rate-limit"
        );
        mockGetCoinMarketData.mockRejectedValue(error);

        render(<GrowProfit />);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });
        expect(screen.getByRole("alert")).toHaveTextContent("CoinGecko is rate limiting requests");
    });

    it("retries and recovers from error after clicking retry button", async () => {
        const error = new mockError("Unable to load market data. Please try again.");
        mockGetCoinMarketData.mockRejectedValueOnce(error).mockResolvedValueOnce(marketData);

        render(<GrowProfit />);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole("button", { name: /Retry/i }));

        await waitFor(() => {
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
            expect(screen.getByText("Bitcoin")).toBeInTheDocument();
        });
    });

    it("renders all three coins with correct table headers", async () => {
        mockGetCoinMarketData.mockResolvedValue(marketData);

        render(<GrowProfit />);

        await waitFor(() => {
            expect(screen.getByText("Bitcoin")).toBeInTheDocument();
        });

        const headers = screen.getAllByRole("columnheader");
        expect(headers).toHaveLength(4);
        expect(headers[1]).toHaveTextContent("Price");
        expect(headers[2]).toHaveTextContent("Change");
        expect(headers[3]).toHaveTextContent("Volume(24h)");
    });

    it("displays placeholder values while loading", () => {
        mockGetCoinMarketData.mockImplementation(() => new Promise(() => {
            /* never resolves */
        }));

        render(<GrowProfit />);

        // During loading, the data should show "-" for values
        const cells = screen.getAllByText("-");
        expect(cells.length).toBeGreaterThan(0);
    });

    it("retries make separate requests", async () => {
        const error = new mockError("Unable to load market data. Please try again.");
        mockGetCoinMarketData.mockRejectedValueOnce(error).mockResolvedValueOnce(marketData);

        render(<GrowProfit />);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });

        expect(mockGetCoinMarketData).toHaveBeenCalledTimes(1);

        await userEvent.click(screen.getByRole("button", { name: /Retry/i }));

        await waitFor(() => {
            expect(mockGetCoinMarketData).toHaveBeenCalledTimes(2);
        });
    });
});
