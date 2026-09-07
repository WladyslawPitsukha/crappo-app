"use client"

import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

function ButtonCripto({ link, label }: { link: string; label: string }) {
    return (
        <Link
            href={link}
            aria-label={`Learn more about ${label}`}
            className="flex justify-center items-center rounded-full w-16 h-16 border-2 border-solid border-purple-700 border-opacity-20 mt-9 criptoHoverBut"
        >
            <span className="sr-only">Learn more about {label}</span>
            <FaAngleRight aria-hidden="true" className="w-7 h-7 text-blue-600" />
        </Link>
    );
}

export default ButtonCripto;