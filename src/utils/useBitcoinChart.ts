import { useCallback, useEffect, useRef, useState } from "react";
import * as echarts from 'echarts';
import { CoinGeckoError, getCoinMarketData } from "@/utils/coinGecko";

interface BitcoinData {
    time: string;
    price: number;
}

export type BitcoinMarketStatus = "idle" | "loading" | "ready" | "error" | "rate-limited";

const POLLING_INTERVAL_MS = 60_000;
const MAX_DATA_POINTS = 60;

export const useBitcoinChart = () => {
    const [bitcoinData, setBitcoinData] = useState<BitcoinData[]>([]);
    const [status, setStatus] = useState<BitcoinMarketStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.EChartsType | null>(null);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        try {
            setStatus("loading");
            setError(null);
            const marketData = await getCoinMarketData(signal);
            const currentTime = new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
            });
            setBitcoinData((prevData) => [
                ...prevData.slice(-(MAX_DATA_POINTS - 1)),
                { time: currentTime, price: marketData.bitcoin.price },
            ]);
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

            setError("Unable to load Bitcoin market data. Please try again.");
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        const chartElement = chartRef.current;

        if (!chartElement) {
            return;
        }

        const chart = echarts.init(chartElement);
        chartInstanceRef.current = chart;
        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(chartElement);

        return () => {
            resizeObserver.disconnect();
            chart.dispose();
            chartInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const chart = chartInstanceRef.current;

        if (!chart || bitcoinData.length === 0) {
            return;
        }

        chart.setOption({
            grid: { left: 48, right: 16, top: 16, bottom: 32 },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: bitcoinData.map((datum) => datum.time),
            },
            yAxis: {
                type: 'value',
                name: 'USD',
                scale: true,
            },
            series: [{
                data: bitcoinData.map((datum) => datum.price),
                type: 'line',
                smooth: true,
                showSymbol: false,
                itemStyle: { color: '#00C49F' },
                lineStyle: { color: '#00C49F' },
            }],
        });
    }, [bitcoinData]);

    useEffect(() => {
        const controller = new AbortController();
        void fetchData(controller.signal);
        const intervalId = window.setInterval(() => void fetchData(controller.signal), POLLING_INTERVAL_MS);

        return () => {
            controller.abort();
            window.clearInterval(intervalId);
        };
    }, [fetchData]);

    return { bitcoinData, chartRef, error, status };
};