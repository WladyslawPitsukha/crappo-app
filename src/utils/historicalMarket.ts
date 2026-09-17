export type ChartRange = "1D" | "1W" | "1M" | "1Y";

export type HistoricalPoint = [timestamp: number, price: number];

const rangeDays: Record<ChartRange, number> = { "1D": 1, "1W": 7, "1M": 30, "1Y": 365 };
const cache = new Map<string, { expiresAt: number; prices: HistoricalPoint[] }>();
const CACHE_TTL_MS = 60_000;

function wait(milliseconds: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(resolve, milliseconds);
        signal?.addEventListener("abort", () => {
            window.clearTimeout(timeout);
            reject(new DOMException("The request was aborted.", "AbortError"));
        }, { once: true });
    });
}

export function clearHistoricalMarketCache() {
    cache.clear();
}

export async function getHistoricalMarketData(
    coinId: string,
    range: ChartRange,
    signal?: AbortSignal,
): Promise<HistoricalPoint[]> {
    const key = `${coinId}:${range}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.prices;
    }

    const attempts = 3;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        if (signal?.aborted) {
            throw new DOMException("The request was aborted.", "AbortError");
        }

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${rangeDays[range]}`, { signal });
            if (response.status === 429 || response.status >= 500) {
                throw new Error("Market provider temporarily unavailable.");
            }
            if (!response.ok) {
                throw new Error("Unable to load historical market data.");
            }
            const payload = await response.json() as { prices?: HistoricalPoint[] };
            if (!payload.prices?.length) {
                throw new Error("Historical market data was empty.");
            }
            cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, prices: payload.prices });
            return payload.prices;
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                throw error;
            }
            if (attempt === attempts - 1) {
                throw error;
            }
            await wait(250 * (attempt + 1), signal);
        }
    }

    throw new Error("Unable to load historical market data.");
}