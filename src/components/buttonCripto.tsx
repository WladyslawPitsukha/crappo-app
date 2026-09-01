"use client"

import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

function ButtonCripto({link}: {link: string}) {
    return (
        <Link
            href={link}
            className="flex justify-center items-center rounded-full w-16 h-16 border-2 border-solid border-purple-700 border-opacity-20 mt-9 criptoHoverBut"
        >
            <span className="sr-only">Learn More</span>
            <FaAngleRight aria-hidden="true" className="w-7 h-7 text-blue-600" />
        </Link>
    );
}

export default ButtonCripto;