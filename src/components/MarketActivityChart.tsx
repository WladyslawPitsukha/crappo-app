"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getHistoricalMarketData, type ChartRange } from "@/utils/historicalMarket";

type MarketActivityChartProps = {
    coinName: string;
    days?: number;
};

const ranges: ChartRange[] = ["1D", "1W", "1M", "1Y"];

const coinIds: Record<string, string> = {
    bitcoin: "bitcoin",
    ethereum: "ethereum",
    litecoin: "litecoin",
};

export default function MarketActivityChart({ coinName }: MarketActivityChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [range, setRange] = useState<ChartRange>("1W");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const chartElement = chartRef.current;

        if (!chartElement) {
            return;
        }

        const chart = echarts.init(chartElement);
        const controller = new AbortController();
        const coinId = coinIds[coinName.toLowerCase()] ?? coinName.toLowerCase();

        const loadHistory = async () => {
            try {
                setError(null);
                const prices = await getHistoricalMarketData(coinId, range, controller.signal);
                const points = prices.map(([timestamp, price]) => [new Date(timestamp).toLocaleDateString([], { month: "short", day: "numeric" }), price] as const);

                chart.setOption({
                    title: { text: `${range} ${coinName} Price History` },
                    tooltip: { trigger: "axis" },
                    xAxis: { type: "category", data: points.map(([label]) => label) },
                    yAxis: { type: "value", name: "USD" },
                    series: [{
                        name: `${coinName} price`,
                        type: "line",
                        smooth: true,
                        data: points.map(([, price]) => price),
                    }],
                });
            } catch {
                if (!controller.signal.aborted) {
                    chart.setOption({
                        title: { text: `${coinName} history unavailable` },
                        xAxis: { show: false },
                        yAxis: { show: false },
                        series: [],
                    });
                    setError("Historical data is temporarily unavailable.");
                }
            }
        };

        void loadHistory();

        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(chartElement);

        return () => {
            controller.abort();
            resizeObserver.disconnect();
            chart.dispose();
        };
    }, [coinName, range]);

    return (
        <section aria-label={`${coinName} historical price chart`}>
            <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Chart range">
                {ranges.map((option) => (
                    <button
                        key={option}
                        aria-pressed={range === option}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${range === option ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700"}`}
                        onClick={() => setRange(option)}
                        type="button"
                    >
                        {option}
                    </button>
                ))}
            </div>
            {error && <p className="mb-3 text-sm text-rose-600" role="alert">{error}</p>}
            <div ref={chartRef} role="img" aria-label={`${coinName} ${range} price history chart`} style={{ width: "100%", height: "400px" }} />
        </section>
    );
}