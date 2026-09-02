import { criptoCardArray } from "@/types/CriptoCardProps";
import { CriptoCard } from "./criptoCard";

const  TradeSecurely = () => {
    return (
        <section id="Products" className="flex flex-col items-center bg-neutral-light p-0">
            <article className="my-10 flex max-w-3xl flex-col items-center justify-center gap-6 bg-[rgba(13,13,43,1)]">
                <h2 className="text-center text-3xl font-bold leading-tight text-white sm:text-4xl">
                    Check how much you can earn
                </h2>
                <p className="text-center text-gray-300 text-lg font-normal leading-7 w-3/4">
                    Let’s check your hash rate to see how much you will earn today, Exercitation veniam consequat sunt nostrud amet.
                </p>
            </article>
            <article className="mt-10 flex w-full flex-col gap-12 bg-gradient-to-b from-gray-200 to-gray-100 pb-16 sm:gap-16 sm:pb-24">
                <h3 className="mx-auto mt-10 w-full max-w-3xl text-center text-3xl font-bold leading-tight text-primary sm:text-4xl">
                    Trade securely and market the high growth cryptocurrencies.
                </h3>
                <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
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