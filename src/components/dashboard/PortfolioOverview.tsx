import React, { type ReactNode } from "react";

type PortfolioOverviewProps = {
    value: number;
    invested: number;
    activeAssets: number;
    leader: string;
    children?: ReactNode;
};

export default function PortfolioOverview({ value, invested, activeAssets, leader, children }: PortfolioOverviewProps) {
    return (
        <section className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Wallet summary</h3>
                <span className="text-sm text-gray-300">{activeAssets} active assets</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div><p className="text-sm text-gray-400">Current value</p><p className="mt-1 text-2xl font-bold">${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p></div>
                <div><p className="text-sm text-gray-400">Invested</p><p className="mt-1 text-2xl font-bold">${invested.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p></div>
                <div><p className="text-sm text-gray-400">Allocation leader</p><p className="mt-1 text-2xl font-bold">{leader}</p></div>
            </div>
            {children}
        </section>
    );
}
