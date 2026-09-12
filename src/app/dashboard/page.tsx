"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { CoinGeckoError, getCoinMarketData, type CoinMarketData } from "@/utils/coinGecko";

type DashboardTab = "Overview" | "Performance" | "Portfolio";

type Asset = {
    id: "bitcoin" | "ethereum" | "litecoin";
    name: string;
    symbol: string;
    price: number;
    change: number;
    allocation: number;
    trend: "up" | "down";
};

type ActivityItem = {
    type: string;
    coin: string;
    value: string;
    time: string;
};

const assetConfig = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", allocation: 42 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", allocation: 29 },
    { id: "litecoin", name: "Litecoin", symbol: "LTC", allocation: 15 },
] as const;

const activityFeed: ActivityItem[] = [
    { type: "Buy", coin: "BTC", value: "+0.32 BTC", time: "2 hours ago" },
    { type: "Sell", coin: "ETH", value: "-1.2 ETH", time: "5 hours ago" },
    { type: "Stake", coin: "SOL", value: "+420 SOL", time: "Today" },
    { type: "Transfer", coin: "ADA", value: "+$2,140", time: "Yesterday" },
];

const marketSignals = [
    { label: "24h Volume", value: "$0", tone: "blue" },
    { label: "BTC Dominance", value: "52.1%", tone: "violet" },
    { label: "Fear & Greed", value: "72 / 100", tone: "emerald" },
    { label: "Funding Rate", value: "+0.008%", tone: "amber" },
];

const performanceStats = [
    { label: "Weekly PNL", value: "+$4,280", change: "+8.4%" },
    { label: "Monthly ROI", value: "+$12,910", change: "+18.7%" },
    { label: "Win rate", value: "68%", change: "+5.2%" },
    { label: "Active trades", value: "14", change: "3 new" },
];

export default function DashboardPage() {
    const { isReady, logout, user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<DashboardTab>("Overview");
    const [marketData, setMarketData] = useState<Record<Asset["id"], CoinMarketData> | null>(null);
    const [marketError, setMarketError] = useState<string | null>(null);
    const [isMarketLoading, setIsMarketLoading] = useState(true);
    const [requestNumber, setRequestNumber] = useState(0);

    useEffect(() => {
        if (isReady && !user) {
            router.replace("/login");
        }
    }, [isReady, router, user]);

    useEffect(() => {
        if (!isReady || !user) {
            return;
        }

        const controller = new AbortController();

        const loadMarketData = async () => {
            setIsMarketLoading(true);
            setMarketError(null);

            try {
                setMarketData(await getCoinMarketData(controller.signal));
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }

                setMarketError(error instanceof CoinGeckoError ? error.message : "Unable to load market data.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsMarketLoading(false);
                }
            }
        };

        void loadMarketData();

        return () => controller.abort();
    }, [isReady, requestNumber, user]);

    const portfolioAssets: Asset[] = assetConfig.map((asset) => {
        const currentMarketData = marketData?.[asset.id];

        return {
            ...asset,
            price: currentMarketData?.price ?? 0,
            change: currentMarketData?.change24h ?? 0,
            trend: (currentMarketData?.change24h ?? 0) >= 0 ? "up" : "down",
        };
    });

    const totalVolume = marketData
        ? Object.values(marketData).reduce((sum, asset) => sum + asset.volume24h, 0)
        : 0;

    const portfolioValue = useMemo(
        () => portfolioAssets.reduce((sum, asset) => sum + asset.price * (asset.allocation / 100) * 1000, 0),
        [portfolioAssets],
    );

    if (!isReady || !user) {
        return <main className="p-8 text-white">Loading...</main>;
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 text-white sm:px-6 lg:px-8">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div>
                    <p className="text-sm text-gray-300">Signed in as {user.email}</p>
                    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your dashboard</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-slate-900"
                        href="/"
                    >
                        Home
                    </Link>
                    <button
                        className="rounded-full border border-white/20 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => {
                            logout();
                            router.push("/");
                        }}
                        type="button"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
                <div className="rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_35%),_rgba(15,23,42,0.9)] p-6 shadow-[0_20px_80px_rgba(59,130,246,0.2)]">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-blue-200">Portfolio balance</p>
                            <h2 className="mt-2 text-4xl font-bold">
                                {isMarketLoading ? "Loading..." : `$${portfolioValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                            </h2>
                        </div>
                        <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">
                            +12.4% this month
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3" role="tablist" aria-label="Dashboard tabs">
                        {(["Overview", "Performance", "Portfolio"] as DashboardTab[]).map((tab) => (
                            <button
                                key={tab}
                                aria-selected={activeTab === tab}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    activeTab === tab
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "border border-white/15 bg-white/5 text-gray-200 hover:bg-white/10"
                                }`}
                                onClick={() => setActiveTab(tab)}
                                role="button"
                                type="button"
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {marketSignals.map((signal) => (
                            <div key={signal.label} className={`rounded-2xl border p-4 ${
                                signal.tone === "blue" ? "border-blue-400/30 bg-blue-500/10" :
                                signal.tone === "violet" ? "border-violet-400/30 bg-violet-500/10" :
                                signal.tone === "emerald" ? "border-emerald-400/30 bg-emerald-500/10" : "border-amber-400/30 bg-amber-500/10"
                            }`}>
                                <p className="text-sm text-gray-200">{signal.label}</p>
                                <p className="mt-2 text-xl font-bold">
                                    {signal.label === "24h Volume" && marketData
                                        ? `$${(totalVolume / 1_000_000_000).toFixed(1)}B`
                                        : signal.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {marketError && (
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
                            <span>{marketError}</span>
                            <button
                                className="rounded-full border border-rose-300/40 px-3 py-1.5 font-medium transition hover:bg-rose-200 hover:text-slate-900"
                                onClick={() => setRequestNumber((current) => current + 1)}
                                type="button"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {activeTab === "Overview" && (
                        <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Asset allocation</h3>
                                    <span className="text-sm text-gray-300">{isMarketLoading ? "Updating..." : "Updated now"}</span>
                                </div>
                                <div className="mt-6 space-y-4">
                                    {portfolioAssets.map((asset) => (
                                        <div key={asset.symbol}>
                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="font-medium text-white">{asset.symbol}</span>
                                                <span className="text-gray-300">{asset.allocation}%</span>
                                            </div>
                                            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                                                <div
                                                    className={`h-full rounded-full ${asset.trend === "up" ? "bg-gradient-to-r from-emerald-400 to-blue-500" : "bg-gradient-to-r from-rose-400 to-orange-400"}`}
                                                    style={{ width: `${asset.allocation}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                                <h3 className="text-lg font-semibold">Quick stats</h3>
                                <div className="mt-5 space-y-4">
                                    {performanceStats.map((item) => (
                                        <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/5 p-3">
                                            <div>
                                                <p className="text-sm text-gray-300">{item.label}</p>
                                                <p className="mt-1 text-xl font-bold">{item.value}</p>
                                            </div>
                                            <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-200">{item.change}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Performance" && (
                        <div className="mt-7 space-y-4">
                            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Weekly PNL</h3>
                                    <span className="text-sm text-emerald-300">+8.4%</span>
                                </div>
                                <div className="mt-5 grid grid-cols-7 gap-2">
                                    {[42, 55, 48, 64, 58, 76, 88].map((bar, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2">
                                            <div className="flex h-28 w-full items-end rounded-t-2xl bg-gradient-to-t from-blue-500/60 to-cyan-400/80 p-1">
                                                <div className="w-full rounded-t-xl bg-white/20" style={{ height: `${bar}%` }} />
                                            </div>
                                            <span className="text-[10px] text-gray-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                                    <p className="text-sm text-gray-300">24h Volume</p>
                                    <p className="mt-2 text-3xl font-bold">$18.6B</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                                    <p className="text-sm text-gray-300">Best performer</p>
                                    <p className="mt-2 text-3xl font-bold">BTC</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Portfolio" && (
                        <div className="mt-7 space-y-4">
                            {portfolioAssets.map((asset) => (
                                <div key={asset.symbol} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/30 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${asset.trend === "up" ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                                            {asset.symbol.slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{asset.name}</p>
                                            <p className="text-sm text-gray-400">{asset.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${asset.price.toLocaleString()}</p>
                                        <p className={`text-sm ${asset.change > 0 ? "text-emerald-300" : "text-rose-300"}`}>
                                            {asset.change > 0 ? "+" : ""}{asset.change}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="space-y-6">
                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Watchlist</h3>
                            <span className="text-xs uppercase tracking-[0.2em] text-blue-200">Live</span>
                        </div>
                        <div className="mt-5 space-y-3">
                            {portfolioAssets.map((asset) => (
                                <div key={`${asset.symbol}-watch`} className="flex items-center justify-between rounded-2xl bg-slate-950/40 p-3">
                                    <div>
                                        <p className="font-medium">{asset.symbol}</p>
                                        <p className="text-xs text-gray-400">{asset.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${asset.price.toLocaleString()}</p>
                                        <p className={`text-xs ${asset.change > 0 ? "text-emerald-300" : "text-rose-300"}`}>
                                            {asset.change > 0 ? "+" : ""}{asset.change}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-violet-500/20 to-blue-500/10 p-5">
                        <h3 className="text-lg font-semibold">Recent activity</h3>
                        <div className="mt-5 space-y-3">
                            {activityFeed.map((entry) => (
                                <div key={`${entry.coin}-${entry.time}`} className="rounded-2xl bg-slate-950/30 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-blue-200">
                                            {entry.type}
                                        </span>
                                        <span className="text-xs text-gray-400">{entry.time}</span>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-200">
                                        {entry.coin} <span className="font-semibold text-white">{entry.value}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <h3 className="text-lg font-semibold">Quick actions</h3>
                        <div className="mt-5 flex flex-col gap-3">
                            <button className="rounded-full bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500" type="button">
                                Deposit funds
                            </button>
                            <button className="rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-white hover:bg-white/10" type="button">
                                Trade now
                            </button>
                            <button className="rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-white hover:bg-white/10" type="button">
                                View reports
                            </button>
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}