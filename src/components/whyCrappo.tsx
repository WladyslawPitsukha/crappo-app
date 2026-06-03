import Image from "next/image";
import Img from "../assets/img/Illustrations.png";
import { IoPerson, IoBarChart, IoEarthSharp } from "react-icons/io5";
import { IconType } from "react-icons";
import '../style/hoverAnima.css'

interface ButtonProps {
    text: string;
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

export const Button: React.FC<ButtonProps> = ({ text }) => {
    return (
        <button className="w-auto h-auto p-4 gap-6 rounded-3xl bg-blue-500 hoverButton">
            <h6 className="text-base font-medium leading-27 text-center text-white">{text}</h6>
        </button>
    );
};

export default function WhyCrappo() {
    return (
        <section id="About" className="flex flex-col gap-24">
            <article className="flex justify-between w-auto h-92">
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
            <article className="flex justify-evenly items-center gap-16">
                <Image alt="Picture" className="w-650 h-473" src={Img} />
                <div className="flex flex-col items-start justify-between gap-6 w-96">
                    <h2 className="w text-4xl font-bold leading-20 text-left text-white">Why you should choose CRAPPO</h2>
                    <p className="font-rubik text-base font-normal leading-7 tracking-tighter text-left text-gray-300">
                        Experience the next generation cryptocurrency platform. No financial borders, extra fees, and fake reviews.
                    </p>
                    <Button text="Learn more" />
                </div>
            </article>
        </section>
    );
}