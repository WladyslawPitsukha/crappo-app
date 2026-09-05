import { propsNavBar } from '@/types/PropsNavBar';
import Link from 'next/link';
import '../style/hoveranima.css'

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
                        typeof item === 'string' ? (
                            <p key={key} className="font-rubik text-base font-normal leading-[38px] text-left text-[#F2F2F2]">
                                {item}
                            </p>
                        ) : (
                            <Link
                                className="font-rubik text-base font-normal leading-[38px] text-left text-[#F2F2F2] outline-none titleQuickLink focus-visible:ring-2 focus-visible:ring-blue-300"
                                href={item.href}
                                key={item.title}
                            >
                                {item.title}
                            </Link>
                        )
                    ))}
                </div>
            </article>
        ))
    )
}

export default QuickLinks;