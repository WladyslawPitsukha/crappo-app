import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

const LitecoinRingChart: React.FC = () => {
    const [chartData, setChartData] = useState<{ value: number; name: string }[]>([]);
    const chartRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const generateRandomData = () => {
            const data = [];
            for (let i = 0; i < 5; i++) {
                const code = Math.random().toString(36).substring(7).toUpperCase();
                const price = Math.floor(Math.random() * 10000) + 20000;
                data.push({ value: price, name: code });
            }
            return data;
        };

        setChartData(generateRandomData());
    }, []);

    useEffect(() => {
        if (chartRef.current && chartData.length > 0) {
            const chart = echarts.init(chartRef.current);
            chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: ${c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: chartData.map(item => item.name)
                },
                series: [
                    {
                        name: 'Bitcoin Price',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: chartData
                    }
                ]
            });
        }
    }, [chartData]);

    return (
        <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
    );
};

export default LitecoinRingChart;