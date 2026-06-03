import { ownPriceArray } from "@/types/TypePrice";
import { GetSealsCripto } from "@/utils/getSealsCripto";

const SealsBitcoin: React.FC = () => {
    const chartRef = GetSealsCripto();
    
    return (
        <div className='flex flex-col justify-center items-center gap-2'>
            <div className='flex w-full h-[76px] bg-blue-800 rounded-2xl gap-6 justify-between items-center py-[18px] px-10'>
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
            <div className="flex flex-col relative w-[710px] h-[369px]">
                <div ref={chartRef} className="w-full h-full bg-blue-800 rounded-2xl"></div>
            </div>
        </div>
    );
};

export default SealsBitcoin;