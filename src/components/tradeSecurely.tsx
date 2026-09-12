import { criptoCardArray } from "@/types/CriptoCardProps";
import { CriptoCard } from "./criptoCard";

const  TradeSecurely = () => {
    return (
        <section id="Products" className="flex flex-col items-center bg-neutral-light p-0">
            <article className="my-10 flex max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                    Check how much you can earn
                </h2>
                <p className="w-full max-w-2xl text-base text-gray-300 sm:text-lg">
                    Let’s check your hash rate to see how much you will earn today, Exercitation veniam consequat sunt nostrud amet.
                </p>
            </article>
            <article className="mt-6 flex w-full flex-col gap-8 bg-gradient-to-b from-gray-200 to-gray-100 px-4 pb-16 pt-10 sm:gap-12 sm:pb-24 lg:px-8 xl:px-0">
                <h3 className="mx-auto w-full max-w-3xl text-center text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    Trade securely and market the high growth cryptocurrencies.
                </h3>
                <div className="mx-auto flex w-full max-w-7xl flex-wrap justify-center gap-6 lg:gap-8">
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