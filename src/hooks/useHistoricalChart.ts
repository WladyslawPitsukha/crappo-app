"use client";

import { useEffect, useState } from "react";
import { getHistoricalMarketData, type ChartRange, type HistoricalPoint } from "@/utils/historicalMarket";

export function useHistoricalChart(coinId: string, range: ChartRange) {
    const [prices, setPrices] = useState<HistoricalPoint[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);
        void getHistoricalMarketData(coinId, range, controller.signal).then(setPrices).catch((requestError: unknown) => {
            if (requestError instanceof DOMException && requestError.name === "AbortError") return;
            setError("Historical data is temporarily unavailable.");
        }).finally(() => {
            if (!controller.signal.aborted) setIsLoading(false);
        });
        return () => controller.abort();
    }, [coinId, range]);

    return { prices, error, isLoading };
}
