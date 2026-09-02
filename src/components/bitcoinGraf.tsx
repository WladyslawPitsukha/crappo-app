import React from "react";
import { useBitcoinChart } from "@/utils/useBitcoinChart";

const BitcoinGraf = () => {
    const { bitcoinData, chartRef, error, status } = useBitcoinChart();

    const currentPrice = bitcoinData.length > 0 ? bitcoinData[bitcoinData.length - 1].price : 0;
    const percentageChange = ((currentPrice - 20000) / 20000 * 100).toFixed(2);

    return (
        <div className="relative flex w-full max-w-[580px] flex-col gap-4 lg:h-[427px] lg:block">
            <div className="flex min-h-[298px] w-full flex-col rounded-2xl bg-blue-800 p-6 sm:p-10 lg:absolute lg:left-0 lg:top-0">
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
                                {bitcoinData.length > 0 ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
                            </p>
                        </div>
                    </div>
                    <h5 className="font-inter text-base font-medium text-right text-green-400">
                        {bitcoinData.length > 0 ? `${percentageChange}%` : ''}
                    </h5>
                </div>
                <div ref={chartRef} className="w-full h-[80%]" aria-label="Bitcoin price chart" role="img"></div>
                {status === "loading" && <p className="text-sm text-gray-200" role="status">Loading live Bitcoin data...</p>}
                {error && <p className="text-sm text-red-200" role="alert">{error}</p>}
            </div>
            <div className="z-10 flex h-[184px] w-full flex-col items-start gap-4 rounded-2xl bg-purple-700 px-4 py-6 shadow-lg sm:w-[178px] lg:absolute lg:bottom-4 lg:left-16">
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
            <div className="z-10 flex h-[84px] w-full flex-col items-center justify-center gap-1 rounded-2xl bg-purple-700 px-8 py-4 shadow-lg sm:w-[169px] lg:absolute lg:bottom-20 lg:right-10">
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