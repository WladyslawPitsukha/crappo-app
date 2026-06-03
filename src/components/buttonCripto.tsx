"use client"

import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

function ButtonCripto({link}: {link: string}) {
    const handleClick = () => {
        window.location.href = link;
    }
    
    return (
        <button 
            className="flex justify-center items-center rounded-full w-16 h-16 border-2 border-solid border-purple-700 border-opacity-20 mt-9 criptoHoverBut"
            onClick={handleClick}
        >
            <Link href={link}>
                <span className="text-white font-bold">Learn More</span>
                <FaAngleRight className="w-7 h-7 text-blue-600" />
            </Link>
        </button>
    );
}

export default ButtonCripto;