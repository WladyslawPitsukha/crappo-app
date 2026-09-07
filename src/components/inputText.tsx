import React from 'react';
import { CriptoArrayItems } from '@/types/CriptoArrayItems';
import { CoinMarketData } from '@/utils/coinGecko';

type InputTextProps = CriptoArrayItems & {
    marketData?: CoinMarketData;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
});

const InputText: React.FC<InputTextProps> = ({ icon, color, short, title, marketData }): JSX.Element => {
    const values = marketData
        ? [
            currencyFormatter.format(marketData.price),
            `${marketData.change24h >= 0 ? "+" : ""}${marketData.change24h.toFixed(2)}%`,
            compactCurrencyFormatter.format(marketData.volume24h),
        ]
        : ["-", "-", "-"];
    
    return (
        <tr>
            <td>
                <div className='flex items-center gap-4'>
                    <div style={{ backgroundColor: color }} className="icon-block" aria-hidden="true">
                        {React.createElement(icon)}
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                        <h2 className='font-inter text-lg font-bold leading-tight text-left text-white'>
                            {short}
                        </h2>
                        <h3 className='font-inter text-base font-normal leading-relaxed tracking-wide text-left text-gray-300'>
                            {title}
                        </h3>
                    </div>
                </div>
            </td>
            {values.map((value, index) => (
                <td key={index} className="py-2">
                    <h5 className='font-inter text-lg font-normal leading-relaxed text-left text-gray-300'>
                        {value}
                    </h5>
                </td>
            ))}
        </tr>
    );
}

export default InputText;