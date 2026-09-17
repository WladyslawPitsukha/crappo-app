"use client";

import { useEffect, useState } from "react";
import { CoinGeckoError, getCoinMarketData, type CoinId, type CoinMarketData } from "@/utils/coinGecko";
import { getMarketInsights, type MarketInsights } from "@/utils/backendApi";

export function useMarketData(enabled: boolean, requestNumber = 0) {
    const [marketData, setMarketData] = useState<Record<CoinId, CoinMarketData> | null>(null);
    const [marketError, setMarketError] = useState<string | null>(null);
    const [isMarketLoading, setIsMarketLoading] = useState(true);
    const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    useEffect(() => {
        if (!enabled) return;
        const controller = new AbortController();
        let isFirstRequest = true;
        const refresh = async () => {
            if (isFirstRequest) setIsMarketLoading(true);
            setMarketError(null);
            try {
                setMarketData(await getCoinMarketData(controller.signal));
                setLastUpdated(Date.now());
            } catch (error: unknown) {
                if (error instanceof DOMException && error.name === "AbortError") return;
                setMarketError(error instanceof CoinGeckoError ? error.message : "Unable to load market data.");
            } finally {
                isFirstRequest = false;
                if (!controller.signal.aborted) setIsMarketLoading(false);
            }
        };
        void refresh();
        const intervalId = window.setInterval(() => void refresh(), 60_000);
        return () => {
            controller.abort();
            window.clearInterval(intervalId);
        };
    }, [enabled, requestNumber]);

    useEffect(() => {
        if (!enabled) return;
        void getMarketInsights().then(setMarketInsights).catch(() => setMarketInsights(null));
    }, [enabled]);

    return { marketData, marketError, isMarketLoading, marketInsights, lastUpdated };
}
