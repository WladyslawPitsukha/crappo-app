import { propsNavBar } from '@/types/PropsNavBar';
import '../style/hoverAnima.css'

function QuickLinks () {
    const arrayLinks = [
        {    
            title: "Quick Link",
            array: propsNavBar
        },
        {
            title: "Resources",
            array: ["Download Whitepapper", "Smart Token", "Blockchain Explorer", "Crypto API", "Interest"]
        }
    ];
    
    return(
        arrayLinks.map((obj, index) => (
            <article key={index} className="flex flex-col gap-9 items-start">
                <h5 className="font-rubik text-[20px] font-medium leading-[30px] text-left text-white">
                    {obj.title}
                </h5>
                <div key={index} className="flex flex-col items-start gap-1 mb-[1px] ">
                    {obj.array.map((item, key) =>(
                        <h6 
                            onClick={typeof item === 'object' ? item.onClick : undefined}
                            key={key} 
                            className="font-rubik text-base font-normal leading-[38px] text-left text-[#F2F2F2] cursor-pointer titleQuickLink"
                        >
                            {typeof item === 'string' ? item : item.title}
                        </h6>
                    ))}
                </div>
            </article>
        ))
    )
}

export default QuickLinks;