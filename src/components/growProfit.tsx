"use client";

import React, { useEffect, useState } from 'react';
import '../style/inputText.css';
import '../style/iconBlockStatic.css'
import InputText from './inputText';
import { criptoArray } from '@/utils/criptoArray';
import { CoinGeckoError, CoinId, CoinMarketData, getCoinMarketData } from '@/utils/coinGecko';

type MarketDataStatus = "loading" | "ready" | "error" | "rate-limited";

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

        loadMarketData();
        return () => controller.abort();
    }, [requestNumber]);

    return (
        <div className="bg-custom rounded-lg p-10 table w-full" aria-live="polite">
            <div className='table-row'>
                {["", "Price", "Change", "Volume(24h)"].map((item, index) => (
                    <div className='table-cell' key={index}>
                        <h5 className='font-inter text-base font-semibold leading-tight text-left text-white'>
                            {item}
                        </h5>
                    </div>
                ))}
            </div>
            {criptoArray.map((item, index) => (
                <InputText 
                    key={index}
                    {...item}
                    marketData={marketData?.[item.coinId]}
                />
            ))}
            {status === "loading" && <p className="mt-4 text-sm text-gray-200" role="status">Loading live market data...</p>}
            {error && (
                <div className="mt-4 flex flex-wrap items-center gap-4" role="alert">
                    <p className="text-sm text-red-200">{error}</p>
                    <button
                        className="rounded border border-white px-3 py-1 text-sm font-medium text-white hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => setRequestNumber((currentRequest) => currentRequest + 1)}
                        type="button"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    )
}

export default GrowProfit;