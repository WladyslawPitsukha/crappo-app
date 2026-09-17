import { afterEach, describe, expect, it, vi } from "vitest";
import { clearHistoricalMarketCache, getHistoricalMarketData } from "@/utils/historicalMarket";

describe("historical market data", () => {
    afterEach(() => {
        clearHistoricalMarketCache();
        vi.restoreAllMocks();
    });

    it("requests the selected range and caches the successful response", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ prices: [[1, 10], [2, 11]] }), { status: 200 }));

        await expect(getHistoricalMarketData("bitcoin", "1M")).resolves.toEqual([[1, 10], [2, 11]]);
        await expect(getHistoricalMarketData("bitcoin", "1M")).resolves.toEqual([[1, 10], [2, 11]]);

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock.mock.calls[0]?.[0]).toContain("days=30");
    });

    it("retries rate-limited requests before succeeding", async () => {
        vi.useFakeTimers();
        const fetchMock = vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(new Response("", { status: 429 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ prices: [[1, 10]] }), { status: 200 }));

        const resultPromise = getHistoricalMarketData("ethereum", "1D");
        await vi.advanceTimersByTimeAsync(250);

        await expect(resultPromise).resolves.toEqual([[1, 10]]);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        vi.useRealTimers();
    });
});