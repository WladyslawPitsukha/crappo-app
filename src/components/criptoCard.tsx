import { CriptoCardProps } from "@/types/CriptoCardProps";
import ButtonCripto from "./buttonCripto";
import '../style/hoveranima.css';

export const CriptoCard: React.FC<CriptoCardProps> = ({ id, img: ImgComponent, title, text, symbol, link }) => {
    const getColor = (id: number) => {
        switch(id) {
            case 1:
                return "bg-blue-600";
            case 2:
                return "bg-yellow-500";
            case 3:
                return "bg-gray-400";
            default:
                return "bg-black";
        }
    }

    return (
        <article className="flex w-full max-w-[320px] flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(59,130,246,0.18)] hoverCriptoCard">
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${getColor(id)}`}>
                <ImgComponent aria-hidden="true" className="h-12 w-12 text-white" />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
                <h2 className="text-center text-2xl font-bold leading-tight text-gray-900">
                    {title}
                </h2>
                <h5 className="text-lg font-medium text-gray-400">
                    {symbol}
                </h5>
            </div>
            <p className="w-full text-center text-base font-normal leading-7 tracking-tighter text-slate-600">
                {text}
            </p>
            <ButtonCripto link={link} label={title} />
        </article>
    );
};