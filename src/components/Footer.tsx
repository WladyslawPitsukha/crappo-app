import LogoImg from '../assets/img/Logo.png'
import Logo from "./logo";
import QuickLinks from "./quickLinks";
import { iconsArray, paymentArray } from "@/types/TypeLinks";

export default function Footer() {
    
    return (
        <footer className="flex flex-col gap-32 mt-20">
            <article className="flex items-start justify-between">
                <Logo logo={LogoImg} />
                <QuickLinks />
                <div className="flex gap-24">
                    <div className="flex flex-col gap-10 w-auto h-auto items-start">
                        <h2 className="w-[355px] text-4xl font-medium leading-[48px] text-left text-white">
                            We accept following payment systems
                        </h2>
                        <div className="flex gap items-center justify-between gap-6">
                            {paymentArray.map((obj, index) => (
                                <a
                                    aria-label={`Pay with ${obj.label}`}
                                    href={obj.link}
                                    rel="noreferrer"
                                    target="_blank"
                                    className="flex justify-center items-center w-24 h-16 rounded-lg bg-[rgba(224, 224, 224, 1)]"
                                    key={index}
                                    >
                                    <obj.icon 
                                        aria-hidden="true"
                                        className="w-12 h-12 text-white z-10 p-1 payments"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
            <article className="flex justify-between items-center">
                <h5 className="text-base font-normal leading-7 tracking-tight text-left text-white">
                    ©2021 CRAPPO. All rights reserved
                </h5>
                <div className="flex gap-8 items-center justify-between w-auto h-auto">
                    {iconsArray.map((obj, index) => (
                        <a
                            aria-label={obj.label}
                            href={obj.link}
                            key={index}
                            rel="noreferrer"
                            target="_blank"
                            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <obj.icon aria-hidden="true" className="w-6 h-6 text-white relative svgSocialIcons" />
                        </a>
                    ))}
                </div>
            </article>
        </footer>
    );
}