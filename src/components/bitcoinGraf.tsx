import React, { useEffect } from "react";
import { useBitcoinChart } from "@/utils/useBitcoinChart";

const BitcoinGraf = () => {
    const { bitcoinData, chartRef, fetchData, renderChart } = useBitcoinChart();

    useEffect(() => {
        fetchData().then(() => {
            renderChart();
        });
        const intervalId = setInterval(async () => {
            await fetchData();
            renderChart();
        }, 3600000);

        return () => clearInterval(intervalId);
    }, [fetchData, renderChart]);

    const currentPrice = bitcoinData.length > 0 ? bitcoinData[bitcoinData.length - 1].price : 0;
    const percentageChange = ((currentPrice - 20000) / 20000 * 100).toFixed(2);

    return (
        <div className="relative w-[580px] h-[427px] ml-24">
            <div className="flex flex-col bg-blue-800 rounded-2xl w-[580px] h-[298px] absolute top-0 left-0 p-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-start gap-4">
                        <div></div>
                        <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2">
                                <h5 className="font-inter leading-[29.05px] text-white">
                                    Bitcoin
                                </h5>
                                <h6 className="font-inter leading-[19.36px] text-gray-500">
                                    BTC
                                </h6>
                            </div>
                            <p className="font-inter text-p font-p leading-[16.94px] tracking-[0.01em] text-gray-300">
                                {bitcoinData.length > 0 ? `${currentPrice.toFixed(2)} BTC` : 'Loading...'}
                            </p>
                        </div>
                    </div>
                    <h5 className="font-inter text-base font-medium text-right text-green-400">
                        {bitcoinData.length > 0 ? `${percentageChange}%` : ''}
                    </h5>
                </div>
                <div ref={chartRef} className="w-full h-[80%]"></div>
            </div>
            <div className="flex flex-col py-6 px-4 items-start rounded-2xl gap-4 shadow-lg bg-purple-700 absolute bottom-4 left-16 z-10 h-[184px] w-[178px]">
                <h3 className="font-inter text-lg font-semibold leading-7 tracking-tight text-left text-white">
                    Increase in Trade
                </h3>
                <h3 className="font-inter text-xl font-bold leading-7 tracking-tight text-left text-white">
                    {percentageChange}%
                </h3>
                <h6 className="font-inter text-base font-normal leading-5 tracking-tight text-left text-gray-300">
                    Sell option
                </h6>
            </div>
            <div className="flex flex-col gap-1 py-4 px-8 justify-center items-center rounded-2xl shadow-lg bg-purple-700 absolute bottom-20 right-10 z-10 h-[84px] w-[169px]">
                <h2 className="font-inter text-xl font-bold leading-7 tracking-tight text-center text-white">
                    ${currentPrice.toFixed(2)}
                </h2>
                <h5 className="font-inter text-base font-normal leading-5 tracking-tight text-center text-gray-300">
                    Price in dollar
                </h5>
            </div>
        </div>
    );
};

export default BitcoinGraf;