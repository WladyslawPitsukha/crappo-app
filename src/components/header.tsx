import Blockchain from '../assets/img/blockchain.png'
import Image from "next/image";

export default function Header() {
    return(
        <section id='Home' className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-16">
            <article className="flex max-w-xl flex-col items-start gap-6">
                <h1 className="text-4xl font-bold leading-tight text-left text-white sm:text-5xl">
                    Fastest & secure platform to invest in crypto
                </h1>
                <p className="max-w-md text-base font-normal leading-7 text-left text-gray-300">
                    Buy and sell cryptocurrencies, trusted by 10M wallets with over $30 billion in transactions.
                </p>
            </article>
            <Image
                className="h-auto w-full max-w-xl" 
                src={Blockchain}
                alt="Blockchain"
            />
        </section>
    )
}