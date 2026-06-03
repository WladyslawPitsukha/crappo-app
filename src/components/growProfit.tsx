import React from 'react';
import '../style/inputText.css';
import '../style/iconBlockStatic.css'
import InputText from './inputText';
import { criptoArray } from '@/utils/criptoArray';

const GrowProfit: React.FC = () => {
    return (
        <div className="bg-custom rounded-lg p-10 table w-full">
            <div className='table-row'>
                {["", "Price", "Change", "Volume(24h)"].map((item, index) => (
                    <div className='table-cell' key={index}>
                        <h5 className='font-inter text-base font-semibold leading-tight text-left text-white'>
                            {item}
                        </h5>
                    </div>
                ))}
            </div>
            {criptoArray.map((item, index) => (
                <InputText 
                    key={index}
                    color={item.color}
                    icon={item.icon}
                    short={item.short}
                    title={item.title}
                    price={item.price} 
                    change={item.change} 
                    volume={item.volume} 
                />
            ))}
        </div>
    )
}

export default GrowProfit;