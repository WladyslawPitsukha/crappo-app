"use client";

import { useEffect, useState } from "react";
import { CoinGeckoError, getCoinMarketData, type CoinId, type CoinMarketData } from "@/utils/coinGecko";
import { getMarketInsights, type MarketInsights } from "@/utils/backendApi";

export function useMarketData(enabled: boolean, requestNumber = 0) {
    const [marketData, setMarketData] = useState<Record<CoinId, CoinMarketData> | null>(null);
    const [marketError, setMarketError] = useState<string | null>(null);
    const [isMarketLoading, setIsMarketLoading] = useState(true);
    const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);

    useEffect(() => {
        if (!enabled) return;
        const controller = new AbortController();
        setIsMarketLoading(true);
        setMarketError(null);
        void getCoinMarketData(controller.signal).then(setMarketData).catch((error: unknown) => {
            if (error instanceof DOMException && error.name === "AbortError") return;
            setMarketError(error instanceof CoinGeckoError ? error.message : "Unable to load market data.");
        }).finally(() => {
            if (!controller.signal.aborted) setIsMarketLoading(false);
        });
        return () => controller.abort();
    }, [enabled, requestNumber]);

    useEffect(() => {
        if (!enabled) return;
        void getMarketInsights().then(setMarketInsights).catch(() => setMarketInsights(null));
    }, [enabled]);

    return { marketData, marketError, isMarketLoading, marketInsights };
}
