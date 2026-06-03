import Blockchain from '../assets/img/blockchain.png'
import Image from "next/image";

export default function Header() {
    return(
        <section id='Home' className="h-auto w-auto flex flex-row">
            <article className="flex flex-col items-start gap-6 w-auto m-20">
                <h2 className="text-5xl font-bold leading-76 text-left text-white w-[588px]">
                    Fastest & secure platform to invest in crypto
                </h2>
                <p className="text-base font-normal leading-28 tracking-tighter text-left text-gray-300 w-[435px]">
                    Buy and sell cryptocurrencies, trusted by 10M wallets with over $30 billion in transactions.
                </p>
            </article>
            <Image
                className="w-604 h-585.15" 
                src={Blockchain}
                alt="Blockchain"
            />
        </section>
    )
}