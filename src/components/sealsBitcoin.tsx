import { ownPriceArray } from "@/types/TypePrice";
import { GetSealsCripto } from "@/utils/getSealsCripto";

const SealsBitcoin: React.FC = () => {
    const chartRef = GetSealsCripto();
    
    return (
        <div className='flex w-full max-w-[710px] flex-col items-center justify-center gap-2'>
            <div className='grid w-full grid-cols-3 gap-3 rounded-2xl bg-blue-800 px-5 py-4 sm:flex sm:h-[76px] sm:items-center sm:justify-between sm:gap-6 sm:px-10'>
                {ownPriceArray.map(item => (
                    <div className="flex flex-col items-start gap-1" key={item.title}>
                        <h3 className="text-[14px] font-medium leading-[21px] tracking-[0.01em] text-left text-white">
                            ${item.price()}
                        </h3>
                        <h5 className="text-[10px] font-normal leading-[15px] tracking-[0.01em] text-left text-gray-300">
                            {item.title}
                        </h5>
                    </div>
                ))}
            </div>
            <div className="relative flex h-[280px] w-full flex-col sm:h-[369px]">
                <div ref={chartRef} className="w-full h-full bg-blue-800 rounded-2xl"></div>
            </div>
        </div>
    );
};

export default SealsBitcoin;