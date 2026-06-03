import React, { Suspense, lazy } from 'react';
import Description from './descriptionCoin';

const BitcoinGraf = lazy(() => import("./bitcoinGraf"));
const Sealsbitcoin = lazy(() => import("./sealsBitcoin"));
const GrowProfit = lazy(() => import("./growProfit"));

const Features = () => {
    return (
        <section id='Features' className="flex flex-col items-center gap-25 bg-gradient-to-b from-purple-900 to-purple-800">
            <h1 className="w-[758px] font-rubik text-4xl font-bold leading-60 text-center text-white mb-24">
                Market sentiments, portfolio, and run the infrastructure of your choice
            </h1>
            <article className="flex items-start justify-evenly mt-24">
                <Description id={1} title="" desc="" link="" />
                <Suspense fallback={<div>Loading BitcoinGraf...</div>}>
                    <BitcoinGraf />
                </Suspense>
            </article>
            <article className="flex mt-5 gap-24">
                <Suspense fallback={<div>Loading Sealbitcoin</div>}>
                    <Sealsbitcoin />
                </Suspense>
                <Description id={2} title="" desc="" link="" />
            </article>
            <article className="flex mt-5 gap-24">
                <Description id={3} title="" desc="" link="" />
                <Suspense fallback={<div>Loading GrowProfit...</div>}>
                    <GrowProfit />
                </Suspense>
            </article>
        </section>
    )
}

export default Features;