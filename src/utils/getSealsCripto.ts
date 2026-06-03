import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface TradeData {
    date: string;
    buyPrice: number;
    sellPrice: number;
}

const dummyData: TradeData[] = [
    { date: '2024-07-01', buyPrice: 18500, sellPrice: 19000 },
    { date: '2024-07-02', buyPrice: 18800, sellPrice: 19200 },
    { date: '2024-07-03', buyPrice: 18750, sellPrice: 19300 },
    { date: '2024-07-04', buyPrice: 19000, sellPrice: 19500 },
    { date: '2024-07-05', buyPrice: 19200, sellPrice: 19800 },
    { date: '2024-07-06', buyPrice: 19100, sellPrice: 19600 },
    { date: '2024-07-07', buyPrice: 18950, sellPrice: 19400 },
    { date: '2024-07-08', buyPrice: 18800, sellPrice: 19200 },
    { date: '2024-07-09', buyPrice: 18650, sellPrice: 19000 },
    { date: '2024-07-10', buyPrice: 18500, sellPrice: 18800 },
    { date: '2024-07-11', buyPrice: 18700, sellPrice: 19000 },
    { date: '2024-07-12', buyPrice: 18850, sellPrice: 19250 },
    { date: '2024-07-13', buyPrice: 19000, sellPrice: 19500 },
    { date: '2024-07-14', buyPrice: 19250, sellPrice: 19800 },
    { date: '2024-07-15', buyPrice: 19150, sellPrice: 19700 },
    { date: '2024-07-16', buyPrice: 19300, sellPrice: 19900 },
    { date: '2024-07-17', buyPrice: 19500, sellPrice: 20000 },
    { date: '2024-07-18', buyPrice: 19650, sellPrice: 20200 },
    { date: '2024-07-19', buyPrice: 19800, sellPrice: 20400 },
    { date: '2024-07-20', buyPrice: 20000, sellPrice: 20600 },
    { date: '2024-07-21', buyPrice: 20200, sellPrice: 20800 },
    { date: '2024-07-22', buyPrice: 20300, sellPrice: 20900 },
    { date: '2024-07-23', buyPrice: 20450, sellPrice: 21050 },
    { date: '2024-07-24', buyPrice: 20600, sellPrice: 21200 },
    { date: '2024-07-25', buyPrice: 20750, sellPrice: 21350 },
    { date: '2024-07-26', buyPrice: 20900, sellPrice: 21500 },
    { date: '2024-07-27', buyPrice: 21050, sellPrice: 21650 },
    { date: '2024-07-28', buyPrice: 21200, sellPrice: 21800 },
    { date: '2024-07-29', buyPrice: 21350, sellPrice: 21950 },
    { date: '2024-07-30', buyPrice: 21500, sellPrice: 22100 },
    { date: '2024-07-31', buyPrice: 21650, sellPrice: 22250 },
    { date: '2024-08-01', buyPrice: 19000, sellPrice: 19500 },
    { date: '2024-08-02', buyPrice: 19200, sellPrice: 19800 },
    { date: '2024-08-03', buyPrice: 19150, sellPrice: 20000 },
    { date: '2024-08-04', buyPrice: 19300, sellPrice: 20150 },
    { date: '2024-08-05', buyPrice: 19450, sellPrice: 20300 },
    { date: '2024-08-06', buyPrice: 19600, sellPrice: 20450 }
];

export const GetSealsCripto = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current);
            const dates = dummyData.map(d => d.date);
            const buyPrices = dummyData.map(d => d.buyPrice);
            const sellPrices = dummyData.map(d => d.sellPrice);

            chart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Buy Price', 'Sell Price']
                },
                xAxis: {
                    type: 'category',
                    data: dates
                },
                yAxis: {
                    type: 'value',
                    name: 'Price (USD)'
                },
                series: [
                    {
                        name: 'Buy Price',
                        type: 'line',
                        data: buyPrices,
                        itemStyle: {
                            color: '#00C49F'
                        },
                        lineStyle: {
                            color: '#00C49F'
                        }
                    },
                    {
                        name: 'Sell Price',
                        type: 'line',
                        data: sellPrices,
                        itemStyle: {
                            color: '#FF6347'
                        },
                        lineStyle: {
                            color: '#FF6347'
                        }
                    }
                ]
            });
        }
    }, []);

    return chartRef;
}