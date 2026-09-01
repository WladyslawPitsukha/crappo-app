export type CoinId = "bitcoin" | "ethereum" | "litecoin";

export type CoinMarketData = {
    price: number;
    change24h: number;
    volume24h: number;
};

type CoinGeckoMarketResponse = {
    id: string;
    current_price: number | null;
    price_change_percentage_24h: number | null;
    total_volume: number | null;
};

export class CoinGeckoError extends Error {
    constructor(message: string, public readonly kind: "request" | "rate-limit" | "timeout" = "request") {
        super(message);
        this.name = "CoinGeckoError";
    }
}

const coinIds: CoinId[] = ["bitcoin", "ethereum", "litecoin"];

export async function getCoinMarketData(signal?: AbortSignal): Promise<Record<CoinId, CoinMarketData>> {
    const timeoutSignal = AbortSignal.timeout(8_000);
    const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
    let response: Response;

    try {
        response = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,litecoin&price_change_percentage=24h",
            { signal: requestSignal, next: { revalidate: 60 } },
        );
    } catch (error) {
        if (timeoutSignal.aborted && !signal?.aborted) {
            throw new CoinGeckoError("Market data request timed out. Please try again.", "timeout");
        }

        throw error;
    }

    if (response.status === 429) {
        throw new CoinGeckoError("CoinGecko is rate limiting requests. Please try again shortly.", "rate-limit");
    }

    if (!response.ok) {
        throw new CoinGeckoError("Unable to load market data. Please try again.");
    }

    const responseData = await response.json() as CoinGeckoMarketResponse[];
    const marketData = {} as Record<CoinId, CoinMarketData>;

    for (const coinId of coinIds) {
        const coin = responseData.find((item) => item.id === coinId);

        if (!coin || coin.current_price === null || coin.price_change_percentage_24h === null || coin.total_volume === null) {
            throw new CoinGeckoError("CoinGecko returned incomplete market data. Please try again.");
        }

        marketData[coinId] = {
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            volume24h: coin.total_volume,
        };
    }

    return marketData;
}