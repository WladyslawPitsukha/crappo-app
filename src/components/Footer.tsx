import LogoImg from '../assets/img/Logo.png'
import Logo from "./logo";
import QuickLinks from "./quickLinks";
import { iconsArray, paymentArray } from "@/types/TypeLinks";

export default function Footer() {
    
    return (
        <footer className="mt-20 flex flex-col gap-10 border-t border-white/10 px-4 pb-12 pt-10 sm:px-6 lg:px-8">
            <article className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                <Logo logo={LogoImg} />
                <QuickLinks />
                <div className="flex w-full max-w-xl flex-col gap-6 lg:items-start">
                    <h2 className="max-w-xs text-2xl font-medium leading-tight text-left text-white sm:text-3xl lg:text-4xl">
                        We accept following payment systems
                    </h2>
                    <div className="flex flex-wrap items-center gap-4">
                        {paymentArray.map((obj, index) => (
                            <a
                                aria-label={`Pay with ${obj.label}`}
                                href={obj.link}
                                rel="noreferrer"
                                target="_blank"
                                className="flex h-16 w-24 items-center justify-center rounded-xl bg-[rgba(224,224,224,1)] shadow-md transition hover:-translate-y-0.5"
                                key={index}
                                >
                                <obj.icon 
                                    aria-hidden="true"
                                    className="h-10 w-10 p-1 text-white"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </article>
            <article className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                <h5 className="text-base font-normal leading-7 tracking-tight text-left text-white/80">
                    ©2021 CRAPPO. All rights reserved
                </h5>
                <div className="flex items-center justify-between gap-6">
                    {iconsArray.map((obj, index) => (
                        <a
                            aria-label={obj.label}
                            href={obj.link}
                            key={index}
                            rel="noreferrer"
                            target="_blank"
                            className="rounded-sm text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <obj.icon aria-hidden="true" className="h-6 w-6" />
                        </a>
                    ))}
                </div>
            </article>
        </footer>
    );
}