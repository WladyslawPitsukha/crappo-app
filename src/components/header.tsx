import React from "react";
import Blockchain from '../assets/img/blockchain.png'
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return(
        <section id='Home' className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 pb-16 pt-8 sm:px-6 lg:flex-row lg:justify-between lg:gap-16 lg:px-8 xl:px-0">
            <article className="flex max-w-xl flex-col items-start gap-6 text-left">
                <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
                    Trusted crypto exchange
                </span>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Fastest & secure platform to invest in crypto
                </h1>
                <p className="max-w-lg text-base font-normal leading-7 text-gray-300 sm:text-lg">
                    Buy and sell cryptocurrencies, trusted by 10M wallets with over $30 billion in transactions.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                        className="inline-flex items-center justify-center rounded-full bg-blue-500 px-7 py-4 font-medium text-white shadow-lg shadow-blue-500/30 outline-none hover:bg-blue-400 focus-visible:ring-2 focus-visible:ring-blue-300"
                        href="/register"
                    >
                        Try for Free
                    </Link>
                    <Link
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 font-medium text-white outline-none hover:border-blue-300 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-300"
                        href="/#Products"
                    >
                        Explore market
                    </Link>
                </div>
                <div className="mt-2 flex flex-wrap gap-6 text-sm text-gray-300">
                    <div>
                        <span className="block text-2xl font-bold text-white">$30B</span>
                        <span>Volume traded</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-white">10M+</span>
                        <span>Wallets</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-white">195</span>
                        <span>Countries</span>
                    </div>
                </div>
            </article>
            <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
                <Image
                    className="h-auto w-full rounded-[20px] object-cover"
                    src={Blockchain}
                    alt="Blockchain"
                />
            </div>
        </section>
    )
}