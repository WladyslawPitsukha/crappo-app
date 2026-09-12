import Image from "next/image";
import Link from "next/link";
import Img from "../assets/img/Illustrations.png";
import { IoPerson, IoBarChart, IoEarthSharp } from "react-icons/io5";
import { IconType } from "react-icons";
import '../style/hoveranima.css'

interface ButtonProps {
    text: string;
    href: string;
}

export const numsArray = [
    {
        icon: IoBarChart,
        number: "$30B",
        text: "Digital Currency Exchanged"
    },
    {
        icon: IoPerson,
        number: "10M+",
        text: "Trusted Wallets Investor"
    },
    {
        icon: IoEarthSharp,
        number: "195",
        text: "Countries Supported"
    }
]

export const Button: React.FC<ButtonProps> = ({ text, href }) => {
    return (
        <Link className="w-auto h-auto rounded-3xl bg-blue-500 p-4 hoverButton" href={href}>
            <h6 className="text-base font-medium leading-27 text-center text-white">{text}</h6>
        </Link>
    );
};

export default function WhyCrappo() {
    return (
        <section id="About" className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:gap-20 lg:px-8">
            <article className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {numsArray.map((obj, index) => {
                    const IconComponent = obj.icon as IconType;
                    return(
                        <div
                            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                            key={index}
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                                <IconComponent aria-hidden="true" className="h-8 w-8 text-[#3671E9]" />
                            </div>

                            <div className="flex flex-col items-start gap-1">
                                <h4 className="text-left text-3xl font-bold leading-none text-white sm:text-[40px]">
                                    {obj.number}
                                </h4>

                                <p className="text-left text-sm font-normal leading-6 text-gray-200 sm:text-base">
                                    {obj.text}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </article>

            <article className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-3 shadow-[0_20px_60px_rgba(59,130,246,0.18)]">
                    <Image alt="Illustration of the CRAPPO cryptocurrency platform" className="h-auto w-full rounded-[22px]" src={Img} />
                </div>
                
                <div className="flex max-w-xl flex-col items-start justify-between gap-6">
                    <h2 className="text-left text-3xl font-bold leading-tight text-white sm:text-4xl">Why you should choose CRAPPO</h2>
                    <p className="text-left text-base font-normal leading-7 tracking-tighter text-gray-300 sm:text-lg">
                        Experience the next generation cryptocurrency platform. No financial borders, extra fees, and fake reviews.
                    </p>

                    <Button href="/#Products" text="Learn more about CRAPPO" />
                </div>
            </article>
        </section>
    );
}