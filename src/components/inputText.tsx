import React, { useEffect, useState } from 'react';
import { CriptoArrayItems } from '@/types/CriptoArrayItems';

const InputText: React.FC<CriptoArrayItems> = ({ icon, color, short, title, price, change, volume }): JSX.Element => {
    const [priceValue, setPriceValue] = useState<string>("");
    const [changeValue, setChangeValue] = useState<string>("");
    const [volumeValue, setVolumeValue] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const priceResult = await price();
            const changeResult = await change();
            const volumeResult = await volume();

            setPriceValue(`$${priceResult}`);
            setChangeValue(`${changeResult}%`);
            setVolumeValue(`$${volumeResult}`);
        }

        fetchData();
    }, [price, change, volume]);
    
    return (
        <div className='table-row'>
            <div className='flex items-center gap-4'>
                <div style={{ backgroundColor: color }} className="icon-block">
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
            {[priceValue, changeValue, volumeValue].map((value, index) => (
                <div className='table-cell' key={index}>
                    <h5 className='font-inter text-lg font-normal leading-relaxed text-left text-gray-300'>
                        {value}
                    </h5>
                </div>
            ))}
        </div>
    );
}

export default InputText;