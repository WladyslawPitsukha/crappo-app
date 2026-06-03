import { criptoCardArray } from "@/types/CriptoCardProps";
import { CriptoCard } from "./criptoCard";

const  TradeSecurely = () => {
    return (
        <section id="Products" className="flex flex-col items-center bg-neutral-light p-0">
            <article className="flex flex-col items-center justify-center bg-[rgba(13, 13, 43, 1)] my-10 gap-6">
                <h2 className="text-center text-white text-4xl font-bold leading-60">
                    Check how much you can earn
                </h2>
                <p className="text-center text-gray-300 text-lg font-normal leading-7 w-3/4">
                    Let’s check your hash rate to see how much you will earn today, Exercitation veniam consequat sunt nostrud amet.
                </p>
            </article>
            <article className="mt-10 pb-24 flex flex-col gap-16 w-full bg-gradient-to-b from-gray-200 to-gray-100">
                <h3 className="text-center text-primary text-4xl font-bold leading-60 w-3/4 mt-10 my-0 mx-auto">
                    Trade securely and market the high growth cryptocurrencies.
                </h3>
                <div className="flex flex-wrap justify-around gap-[45px]">
                    {criptoCardArray.map((obj, index) => (
                        <CriptoCard
                            id={obj.id}
                            key={index}
                            img={obj.img}
                            text={obj.text}
                            title={obj.title}
                            symbol={obj.symbol}
                            link={obj.link}
                        />
                    ))}
                </div>
            </article>
        </section>
    )
}

export default TradeSecurely;