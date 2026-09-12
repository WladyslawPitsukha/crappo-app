import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface LogoProps {
    logo: string | StaticImport
}

export default function Logo(
    {logo}: LogoProps
) {
    return (
        <Link className="flex gap-4 items-center" href="/">
            <Image className="w-auto h-auto" src={logo} alt="Logo" />
            <h4 className="font-inter text-base font-semibold leading-22 tracking-wider text-left text-white">
                CRAPPO
            </h4>
        </Link>
    );
}