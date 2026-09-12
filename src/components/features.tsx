import React, { Suspense, lazy } from 'react';
import Description from './descriptionCoin';

const BitcoinGraf = lazy(() => import("./bitcoinGraf"));
const Sealsbitcoin = lazy(() => import("./sealsBitcoin"));
const GrowProfit = lazy(() => import("./growProfit"));

const Features = () => {
    return (
        <section id='Features' className="flex flex-col items-center gap-16 bg-gradient-to-b from-[#1c1a42] via-[#161b3d] to-[#0d0d2b] px-4 py-16 lg:gap-20 lg:px-8">
            <h2 className="max-w-4xl text-center text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Market sentiments, portfolio, and run the infrastructure of your choice
            </h2>
            <article className="flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
                <Description id={1} title="" desc="" link="" />
                <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(45,88,255,0.18)] backdrop-blur-sm">
                    <Suspense fallback={<div className="flex min-h-[300px] items-center justify-center text-white/70">Loading BitcoinGraf...</div>}>
                        <BitcoinGraf />
                    </Suspense>
                </div>
            </article>
            <article className="flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(45,88,255,0.18)] backdrop-blur-sm">
                    <Suspense fallback={<div className="flex min-h-[300px] items-center justify-center text-white/70">Loading Sealbitcoin</div>}>
                        <Sealsbitcoin />
                    </Suspense>
                </div>
                <Description id={2} title="" desc="" link="" />
            </article>
            <article className="flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <Description id={3} title="" desc="" link="" />
                <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(45,88,255,0.18)] backdrop-blur-sm">
                    <Suspense fallback={<div className="flex min-h-[300px] items-center justify-center text-white/70">Loading GrowProfit...</div>}>
                        <GrowProfit />
                    </Suspense>
                </div>
            </article>
        </section>
    )
}

export default Features;