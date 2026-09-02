import React, { Suspense, lazy } from 'react';
import Description from './descriptionCoin';

const BitcoinGraf = lazy(() => import("./bitcoinGraf"));
const Sealsbitcoin = lazy(() => import("./sealsBitcoin"));
const GrowProfit = lazy(() => import("./growProfit"));

const Features = () => {
    return (
        <section id='Features' className="flex flex-col items-center gap-16 bg-gradient-to-b from-purple-900 to-purple-800 lg:gap-24">
            <h2 className="max-w-3xl font-rubik text-3xl font-bold leading-tight text-center text-white sm:text-4xl">
                Market sentiments, portfolio, and run the infrastructure of your choice
            </h2>
            <article className="flex w-full max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-evenly">
                <Description id={1} title="" desc="" link="" />
                <Suspense fallback={<div>Loading BitcoinGraf...</div>}>
                    <BitcoinGraf />
                </Suspense>
            </article>
            <article className="flex w-full max-w-7xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
                <Suspense fallback={<div>Loading Sealbitcoin</div>}>
                    <Sealsbitcoin />
                </Suspense>
                <Description id={2} title="" desc="" link="" />
            </article>
            <article className="flex w-full max-w-7xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
                <Description id={3} title="" desc="" link="" />
                <Suspense fallback={<div>Loading GrowProfit...</div>}>
                    <GrowProfit />
                </Suspense>
            </article>
        </section>
    )
}

export default Features;