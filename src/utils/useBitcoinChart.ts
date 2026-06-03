import { useState, useRef } from "react";
import * as echarts from 'echarts';
import { FetchBitcoinData } from "@/utils/FetchBitcoinData";

interface ApiBitcoinData {
    bitcoin: {
        usd: number;
    };
}

interface BitcoinData {
    time: string;
    price: number;
}

export const useBitcoinChart = () => {
    const [bitcoinData, setBitcoinData] = useState<BitcoinData[]>([]);
    const chartRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        const data: ApiBitcoinData | null = await FetchBitcoinData();
        if (data) {
            const currentTime = new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
            });
            setBitcoinData((prevData) => [
                ...prevData,
                { time: currentTime, price: data.bitcoin.usd },
            ]);
        }
    };

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

    return { bitcoinData, chartRef, fetchData, renderChart };
};