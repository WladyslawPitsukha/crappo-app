import { useCallback, useRef, useState } from "react";
import * as echarts from 'echarts';
import { CoinGeckoError, getCoinMarketData } from "@/utils/coinGecko";

interface BitcoinData {
    time: string;
    price: number;
}

export type BitcoinMarketStatus = "idle" | "loading" | "ready" | "error" | "rate-limited";

export const useBitcoinChart = () => {
    const [bitcoinData, setBitcoinData] = useState<BitcoinData[]>([]);
    const [status, setStatus] = useState<BitcoinMarketStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        try {
            setStatus("loading");
            setError(null);
            const marketData = await getCoinMarketData();
            const currentTime = new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
            });
            setBitcoinData((prevData) => [
                ...prevData,
                { time: currentTime, price: marketData.bitcoin.price },
            ]);
            setStatus("ready");
        } catch (loadError) {
            if (loadError instanceof CoinGeckoError) {
                setError(loadError.message);
                setStatus(loadError.kind === "rate-limit" ? "rate-limited" : "error");
                return;
            }

            setError("Unable to load Bitcoin market data. Please try again.");
            setStatus("error");
        }
    }, []);

    const renderChart = () => {
        if (chartRef.current && bitcoinData.length > 0) {
            const times = bitcoinData.map(d => d.time);
            const prices = bitcoinData.map(d => d.price);

            const chart = echarts.init(chartRef.current);
            chart.setOption({
                xAxis: {
                    type: 'category',
                    data: times
                },
                yAxis: {
                    type: 'value',
                    name: 'Price (USD)'
                },
                series: [
                    {
                        data: prices,
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            color: '#00C49F'
                        },
                        lineStyle: {
                            color: '#00C49F'
                        }
                    }
                ]
            });
        }
    };

    return { bitcoinData, chartRef, error, fetchData, renderChart, status };
};