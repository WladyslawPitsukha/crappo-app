import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const marketResponse = [
    { id: "bitcoin", current_price: 62000, price_change_percentage_24h: 2.5, total_volume: 1000000 },
    { id: "ethereum", current_price: 3000, price_change_percentage_24h: -1.2, total_volume: 500000 },
    { id: "litecoin", current_price: 80, price_change_percentage_24h: 0.4, total_volume: 100000 },
];

async function loadCoinGecko() {
    vi.resetModules();
    return import("@/utils/coinGecko");
}

describe("getCoinMarketData", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("maps a successful CoinGecko response", async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(marketResponse), { status: 200 }));
        const { getCoinMarketData } = await loadCoinGecko();

        await expect(getCoinMarketData()).resolves.toEqual({
            bitcoin: { price: 62000, change24h: 2.5, volume24h: 1000000 },
            ethereum: { price: 3000, change24h: -1.2, volume24h: 500000 },
            litecoin: { price: 80, change24h: 0.4, volume24h: 100000 },
        });
        expect(fetch).toHaveBeenCalledOnce();
    });

    it("throws a request error for non-success responses", async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));
        const { CoinGeckoError, getCoinMarketData } = await loadCoinGecko();

        await expect(getCoinMarketData()).rejects.toMatchObject({
            constructor: CoinGeckoError,
            kind: "request",
            message: "Unable to load market data. Please try again.",
        });
    });

    it("identifies rate-limit responses", async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 429 }));
        const { CoinGeckoError, getCoinMarketData } = await loadCoinGecko();

        await expect(getCoinMarketData()).rejects.toMatchObject({
            constructor: CoinGeckoError,
            kind: "rate-limit",
        });
    });

    it("rejects incomplete market data", async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(marketResponse.slice(0, 2)), { status: 200 }));
        const { getCoinMarketData } = await loadCoinGecko();

        await expect(getCoinMarketData()).rejects.toThrow("CoinGecko returned incomplete market data.");
    });

    it("does not start a request for an already-aborted signal", async () => {
        const controller = new AbortController();
        controller.abort();
        const { getCoinMarketData } = await loadCoinGecko();

        await expect(getCoinMarketData(controller.signal)).rejects.toMatchObject({ name: "AbortError" });
        expect(fetch).not.toHaveBeenCalled();
    });

    it("caches successful data and shares an in-flight request", async () => {
        let resolveRequest: (response: Response) => void = () => undefined;
        const responsePromise = new Promise<Response>((resolve) => {
            resolveRequest = resolve;
        });
        vi.mocked(fetch).mockReturnValue(responsePromise);
        const { getCoinMarketData } = await loadCoinGecko();

        const firstRequest = getCoinMarketData();
        const secondRequest = getCoinMarketData();
        resolveRequest(new Response(JSON.stringify(marketResponse), { status: 200 }));

        await expect(Promise.all([firstRequest, secondRequest])).resolves.toHaveLength(2);
        await expect(getCoinMarketData()).resolves.toEqual({
            bitcoin: { price: 62000, change24h: 2.5, volume24h: 1000000 },
            ethereum: { price: 3000, change24h: -1.2, volume24h: 500000 },
            litecoin: { price: 80, change24h: 0.4, volume24h: 100000 },
        });
        expect(fetch).toHaveBeenCalledOnce();
    });
});