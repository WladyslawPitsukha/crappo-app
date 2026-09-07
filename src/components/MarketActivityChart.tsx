"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

type MarketActivityChartProps = {
    coinName: string;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MarketActivityChart({ coinName }: MarketActivityChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chartElement = chartRef.current;

        if (!chartElement) {
            return;
        }

        const chart = echarts.init(chartElement);
        const data = days.map(() => Math.floor(Math.random() * 1000));

        chart.setOption({
            title: { text: `Weekly ${coinName} Activity` },
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: days },
            yAxis: { type: "value", name: "Volume" },
            series: [{
                name: "Trading Volume",
                type: "bar",
                data,
            }],
        });

        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(chartElement);

        return () => {
            resizeObserver.disconnect();
            chart.dispose();
        };
    }, [coinName]);

    return (
        <div
            aria-label={`${coinName} weekly trading volume chart`}
            ref={chartRef}
            role="img"
            style={{ width: "100%", height: "400px" }}
        />
    );
}