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
        <section id="About" className="mx-auto flex max-w-7xl flex-col gap-16 lg:gap-24">
            <article className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {numsArray.map((obj, index) => {
                    const IconComponent = obj.icon as IconType;
                    return(
                        <div
                            className="flex items-center gap-3"
                            key={index}
                        >
                            <div className="flex justify-center items-center w-20 h-20 rounded-full bg-white bg-opacity-10">
                                <IconComponent className="w-12 h-12 z-10 text-[#3671E9]" />
                            </div>

                            <div className="flex flex-col items-start gap-1">
                                <h4 className="text-white text-left text-[40px] font-bold leading-[60px]">
                                    {obj.number}
                                </h4>

                                <p className="ext-base font-normal leading-7 tracking-tight text-left text-gray-200">
                                    {obj.text}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </article>

            <article className="flex flex-col items-center gap-10 lg:flex-row lg:justify-evenly lg:gap-16">
                <Image alt="Illustration of the CRAPPO cryptocurrency platform" className="h-auto w-full max-w-2xl" src={Img} />
                
                <div className="flex max-w-md flex-col items-start justify-between gap-6">
                    <h2 className="text-3xl font-bold leading-tight text-left text-white sm:text-4xl">Why you should choose CRAPPO</h2>
                    <p className="font-rubik text-base font-normal leading-7 tracking-tighter text-left text-gray-300">
                        Experience the next generation cryptocurrency platform. No financial borders, extra fees, and fake reviews.
                    </p>

                    <Button href="/#Products" text="Learn more" />
                </div>
            </article>
        </section>
    );
}