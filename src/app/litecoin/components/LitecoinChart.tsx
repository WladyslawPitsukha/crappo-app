import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LitecoinChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const generateRandom = () => {
            const generDay = Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000));

            return generDay;
        }

        if(chartRef.current) {
            const chart = echarts.init(chartRef.current);

            const option = {
                title: {
                    text: 'Weekly Bitcoin Activity'
                },
                tooltip: {},
                xAxis: {
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {},
                series: [{
                    name: 'Trading Volume',
                    type: 'bar',
                    data: generateRandom()
                }]
            }

            chart.setOption(option);
        }
    }, [])

    return(
        <div 
            ref={chartRef} 
            style={{
                width: '100%',
                height: '400px'
            }}
        />
    )
};

export default LitecoinChart;