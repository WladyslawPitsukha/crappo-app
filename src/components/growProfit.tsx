"use client";

import React, { useEffect, useState } from 'react';
import '../style/inputText.css';
import '../style/iconBlockStatic.css';
import InputText from './inputText';
import { criptoArray } from '@/utils/criptoArray';
import { CoinGeckoError, CoinId, CoinMarketData, getCoinMarketData } from '@/utils/coinGecko';

type MarketDataStatus = "loading" | "ready" | "error" | "rate-limited";

const tableHeaders = ["", "Price", "Change", "Volume(24h)"];

function MarketTableHeader() {
    return (
        <tr>
            {tableHeaders.map((item, index) => (
                <th key={`${item}-${index}`} className="pb-2 text-left font-inter text-base font-semibold leading-tight text-white">
                    {item}
                </th>
            ))}
        </tr>
    );
}

function MarketTableRows({ marketData }: { marketData: Record<CoinId, CoinMarketData> | null }) {
    return (
        <>
            {criptoArray.map((item, index) => (
                <InputText
                    key={`${item.coinId}-${index}`}
                    {...item}
                    marketData={marketData?.[item.coinId]}
                />
            ))}
        </>
    );
}

function MarketStatusMessage({ status }: { status: MarketDataStatus }) {
    if (status !== "loading") {
        return null;
    }

    return (
        <p className="mt-4 text-sm text-gray-200" role="status">
            Loading live market data...
        </p>
    );
}

function MarketErrorState({
    error,
    onRetry,
}: {
    error: string | null;
    onRetry: () => void;
}) {
    if (!error) {
        return null;
    }

    return (
        <div className="mt-4 flex flex-wrap items-center gap-4" role="alert">
            <p className="text-sm text-red-200">{error}</p>
            <button
                className="rounded border border-white px-3 py-1 text-sm font-medium text-white hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={onRetry}
                type="button"
            >
                Retry
            </button>
        </div>
    );
}

const GrowProfit: React.FC = () => {
    const [marketData, setMarketData] = useState<Record<CoinId, CoinMarketData> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<MarketDataStatus>("loading");
    const [requestNumber, setRequestNumber] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const loadMarketData = async () => {
            try {
                setError(null);
                setStatus("loading");
                setMarketData(await getCoinMarketData(controller.signal));
                setStatus("ready");
            } catch (loadError) {
                if (loadError instanceof DOMException && loadError.name === "AbortError") {
                    return;
                }

                if (loadError instanceof CoinGeckoError) {
                    setError(loadError.message);
                    setStatus(loadError.kind === "rate-limit" ? "rate-limited" : "error");
                    return;
                }

                setError("Unable to load market data. Please try again.");
                setStatus("error");
            }
        };

        void loadMarketData();
        return () => controller.abort();
    }, [requestNumber]);

    return (
        <div className="bg-custom w-full rounded-lg p-10" aria-live="polite">
            <table className="w-full border-separate border-spacing-y-2 text-left">
                <thead>
                    <MarketTableHeader />
                </thead>
                <tbody>
                    <MarketTableRows marketData={marketData} />
                </tbody>
            </table>
            <MarketStatusMessage status={status} />
            <MarketErrorState
                error={error}
                onRetry={() => setRequestNumber((currentRequest) => currentRequest + 1)}
            />
        </div>
    );
};

export default GrowProfit;