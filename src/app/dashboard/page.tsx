"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { CoinGeckoError, getCoinMarketData, type CoinMarketData } from "@/utils/coinGecko";
import { createBackendTrade, getBackendPortfolio, getMarketInsights, upsertBackendHolding, type MarketInsights } from "@/utils/backendApi";
import { assetConfig, type AssetId } from "@/data/assets";
import { useWatchlist } from "@/hooks/useWatchlist";

type DashboardTab = "Overview" | "Performance" | "Portfolio";

type Asset = {
    id: AssetId;
    name: string;
    symbol: string;
    price: number;
    change: number;
    allocation: number;
    quantity: number;
    averageCost: number;
    value: number;
    trend: "up" | "down";
};

type Holding = {
    quantity: number;
    averageCost: number;
};

type TradeType = "buy" | "sell";

type PortfolioTransaction = {
    id: string;
    type: TradeType;
    symbol: string;
    quantity: number;
    price: number;
    total: number;
    createdAt: string;
};

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
    const userEmail = user?.email;
    const [activeTab, setActiveTab] = useState<DashboardTab>("Overview");
    const [marketData, setMarketData] = useState<Record<Asset["id"], CoinMarketData> | null>(null);
    const [marketError, setMarketError] = useState<string | null>(null);
    const [isMarketLoading, setIsMarketLoading] = useState(true);
    const [requestNumber, setRequestNumber] = useState(0);
    const [holdings, setHoldings] = useState<Record<string, Holding>>({});
    const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);
    const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null);
    const [watchlistSearch, setWatchlistSearch] = useState("");
    const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
    const [pendingTrade, setPendingTrade] = useState<{ type: TradeType; asset: Asset; quantity: number } | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<PortfolioTransaction | null>(null);
    const [tradeType, setTradeType] = useState<TradeType>("buy");
    const [selectedAssetId, setSelectedAssetId] = useState<Asset["id"]>("bitcoin");
    const [tradeQuantity, setTradeQuantity] = useState("");
    const [tradeError, setTradeError] = useState<string | null>(null);
    const { watchlist, toggleWatchlist } = useWatchlist(userEmail);

    useEffect(() => {
        if (isReady && !user) {
            router.replace("/login");
        }
    }, [isReady, router, user]);

    useEffect(() => {
        if (!isReady || !userEmail) {
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
    }, [isReady, requestNumber, userEmail]);

    useEffect(() => {
        if (!userEmail) {
            return;
        }

        const storedPortfolio = localStorage.getItem(`crappo-portfolio-${userEmail}`);

        if (!storedPortfolio) {
            setHoldings({});
            setTransactions([]);
            return;
        }

        try {
            const parsedPortfolio = JSON.parse(storedPortfolio) as {
                holdings?: Record<string, Holding>;
                transactions?: PortfolioTransaction[];
            };
            setHoldings(parsedPortfolio.holdings ?? {});
            setTransactions(parsedPortfolio.transactions ?? []);
        } catch {
            setHoldings({});
            setTransactions([]);
        }
    }, [userEmail]);

    useEffect(() => {
        if (!userEmail) return;
        void getMarketInsights().then(setMarketInsights).catch(() => setMarketInsights(null));
    }, [userEmail]);

    useEffect(() => {
        if (!userEmail) {
            return;
        }

        const loadBackendPortfolio = async () => {
            try {
                const portfolio = await getBackendPortfolio();
                const nextHoldings: Record<string, Holding> = {};

                for (const holding of portfolio.holdings) {
                    const asset = assetConfig.find((item) => item.symbol === holding.symbol);

                    if (asset) {
                        nextHoldings[asset.id] = {
                            quantity: holding.quantity,
                            averageCost: holding.average_cost,
                        };
                    }
                }

                setHoldings(nextHoldings);
                setTransactions(portfolio.transactions.map((transaction) => ({
                    id: String(transaction.id),
                    type: transaction.type,
                    symbol: transaction.symbol,
                    quantity: transaction.quantity,
                    price: transaction.price_per_coin,
                    total: transaction.total_value,
                    createdAt: transaction.created_at,
                })));
            } catch {
                // Local persistence remains the development fallback when the API is offline.
            }
        };

        void loadBackendPortfolio();
    }, [userEmail]);

    const portfolioAssets = useMemo<Asset[]>(() => {
        const pricedAssets = assetConfig.map((asset) => {
            const currentMarketData = marketData?.[asset.id];
            const holding = holdings[asset.id] ?? { quantity: 0, averageCost: 0 };

            return {
                ...asset,
                price: currentMarketData?.price ?? 0,
                change: currentMarketData?.change24h ?? 0,
                quantity: holding.quantity,
                averageCost: holding.averageCost,
                value: holding.quantity * (currentMarketData?.price ?? 0),
                allocation: 0,
                trend: (currentMarketData?.change24h ?? 0) >= 0 ? "up" as const : "down" as const,
            };
        });
        const totalValue = pricedAssets.reduce((sum, asset) => sum + asset.value, 0);

        return pricedAssets.map((asset) => ({
            ...asset,
            allocation: totalValue > 0 ? (asset.value / totalValue) * 100 : 0,
        }));
    }, [holdings, marketData]);

    const totalVolume = marketData
        ? Object.values(marketData).reduce((sum, asset) => sum + asset.volume24h, 0)
        : 0;

    const portfolioValue = useMemo(() => portfolioAssets.reduce((sum, asset) => sum + asset.value, 0), [portfolioAssets]);
    const investedValue = useMemo(() => portfolioAssets.reduce(
        (sum, asset) => sum + asset.quantity * asset.averageCost,
        0,
    ), [portfolioAssets]);
    const portfolioPnl = portfolioValue - investedValue;
    const recentActivity = useMemo(() => transactions.slice(0, 4).map((transaction) => ({
        type: transaction.type,
        coin: transaction.symbol,
        value: `${transaction.type === "buy" ? "+" : "-"}${transaction.quantity} ${transaction.symbol}`,
        time: new Date(transaction.createdAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }),
    })), [transactions]);
    const transactionAnalytics = useMemo(() => {
        const totalVolume = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
        const buyCount = transactions.filter((transaction) => transaction.type === "buy").length;
        const sellCount = transactions.filter((transaction) => transaction.type === "sell").length;
        const activeAssets = new Set(transactions.map((transaction) => transaction.symbol)).size;

        return {
            totalVolume,
            averageTrade: transactions.length > 0 ? totalVolume / transactions.length : 0,
            buyCount,
            sellCount,
            activeAssets,
        };
    }, [transactions]);
    const watchlistAssets = useMemo(() => {
        const ids = watchlist.length > 0 ? watchlist : assetConfig.map((asset) => asset.id);

        return ids.map((assetId) => {
            const assetMeta = assetConfig.find((asset) => asset.id === assetId) ?? assetConfig[0];
            const currentMarketData = marketData?.[assetId];

            return {
                ...assetMeta,
                price: currentMarketData?.price ?? 0,
                change: currentMarketData?.change24h ?? 0,
                value: 0,
                quantity: 0,
                averageCost: 0,
                allocation: 0,
                trend: (currentMarketData?.change24h ?? 0) >= 0 ? "up" : "down",
            };
        });
    }, [marketData, watchlist]);

    const searchableAssets = useMemo(() => assetConfig.filter((asset) => `${asset.name} ${asset.symbol}`.toLowerCase().includes(watchlistSearch.toLowerCase())), [watchlistSearch]);

    const persistPortfolio = (nextHoldings: Record<string, Holding>, nextTransactions: PortfolioTransaction[]) => {
        if (!user) {
            return;
        }

        localStorage.setItem(`crappo-portfolio-${user.email}`, JSON.stringify({
            holdings: nextHoldings,
            transactions: nextTransactions,
        }));
    };

    const handleWatchlistToggle = async (assetId: Asset["id"]) => {
        const asset = assetConfig.find((item) => item.id === assetId);
        if (!asset) {
            return;
        }
        const isAlreadyWatched = watchlist.includes(assetId);
        await toggleWatchlist(assetId);
        setWatchlistMessage(isAlreadyWatched ? `${asset.name} was removed from your watchlist.` : `${asset.name} is in your watchlist.`);
    };

    const handleTrade = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const quantity = Number(tradeQuantity);
        const selectedAsset = portfolioAssets.find((asset) => asset.id === selectedAssetId);

        if (!selectedAsset || !Number.isFinite(quantity) || quantity <= 0 || selectedAsset.price <= 0) {
            setTradeError("Enter a valid quantity after market data has loaded.");
            return;
        }

        const currentHolding = holdings[selectedAssetId] ?? { quantity: 0, averageCost: 0 };

        if (tradeType === "sell" && quantity > currentHolding.quantity) {
            setTradeError(`You only hold ${currentHolding.quantity} ${selectedAsset.symbol}.`);
            return;
        }

        setPendingTrade({ type: tradeType, asset: selectedAsset, quantity });
    };

    const confirmTrade = async () => {
        if (!pendingTrade) return;
        const { asset: selectedAsset, quantity, type: confirmedTradeType } = pendingTrade;
        const currentHolding = holdings[selectedAsset.id] ?? { quantity: 0, averageCost: 0 };
        const nextQuantity = confirmedTradeType === "buy"
            ? currentHolding.quantity + quantity
            : currentHolding.quantity - quantity;
        const nextAverageCost = confirmedTradeType === "buy"
            ? ((currentHolding.quantity * currentHolding.averageCost) + (quantity * selectedAsset.price)) / nextQuantity
            : nextQuantity > 0 ? currentHolding.averageCost : 0;
        const nextHoldings = { ...holdings };

        if (nextQuantity > 0) {
            nextHoldings[selectedAssetId] = { quantity: nextQuantity, averageCost: nextAverageCost };
        } else {
            delete nextHoldings[selectedAssetId];
        }

        const nextTransactions = [{
            id: `${Date.now()}-${selectedAssetId}`,
            type: confirmedTradeType,
            symbol: selectedAsset.symbol,
            quantity,
            price: selectedAsset.price,
            total: quantity * selectedAsset.price,
            createdAt: new Date().toISOString(),
        }, ...transactions].slice(0, 20);

        setHoldings(nextHoldings);
        setTransactions(nextTransactions);
        persistPortfolio(nextHoldings, nextTransactions);

        {
            try {
                await createBackendTrade({
                    symbol: selectedAsset.symbol,
                    type: tradeType,
                    quantity,
                    price_per_coin: selectedAsset.price,
                    total_value: quantity * selectedAsset.price,
                });
                await upsertBackendHolding({
                    symbol: selectedAsset.symbol,
                    name: selectedAsset.name,
                    quantity: nextQuantity,
                    average_cost: nextAverageCost,
                    replace: true,
                });
            } catch {
                // The local record above keeps the interaction usable if the API drops.
            }
        }

        setTradeQuantity("");
        setTradeError(null);
        setPendingTrade(null);
    };

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
                        <div className={`rounded-full border px-3 py-1 text-sm font-medium ${
                            portfolioPnl >= 0
                                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                                : "border-rose-400/40 bg-rose-500/10 text-rose-200"
                        }`}>
                            {investedValue > 0 ? `${portfolioPnl >= 0 ? "+" : ""}$${portfolioPnl.toLocaleString("en-US", { maximumFractionDigits: 2 })} P&L` : "No positions yet"}
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
                                role="tab"
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
                            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5 lg:col-span-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Wallet summary</h3>
                                    <span className="text-sm text-gray-300">{transactionAnalytics.activeAssets} active assets</span>
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                    <div><p className="text-sm text-gray-400">Current value</p><p className="mt-1 text-2xl font-bold">${portfolioValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p></div>
                                    <div><p className="text-sm text-gray-400">Invested</p><p className="mt-1 text-2xl font-bold">${investedValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p></div>
                                    <div><p className="text-sm text-gray-400">Allocation leader</p><p className="mt-1 text-2xl font-bold">{portfolioAssets.toSorted((a, b) => b.allocation - a.allocation)[0]?.symbol ?? "-"}</p></div>
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
                                    <p className="mt-2 text-3xl font-bold">${(totalVolume / 1_000_000_000).toFixed(1)}B</p>
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
                                        <p className="font-semibold">${asset.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                                        <p className="text-xs text-gray-400">{asset.quantity.toFixed(6)} {asset.symbol}</p>
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
                        <input
                            aria-label="Search watchlist assets"
                            className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
                            onChange={(event) => setWatchlistSearch(event.target.value)}
                            placeholder="Search coins"
                            value={watchlistSearch}
                        />
                        <div className="mt-5 space-y-3">
                            {watchlistAssets.filter((asset) => searchableAssets.some((candidate) => candidate.id === asset.id)).map((asset) => {
                                const isWatched = watchlist.includes(asset.id);

                                return (
                                    <div key={`${asset.symbol}-watch`} className="flex items-center justify-between gap-2 rounded-2xl bg-slate-950/40 p-3">
                                        <div>
                                            <p className="font-medium">{asset.symbol}</p>
                                            <p className="text-xs text-gray-400">{asset.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-right">
                                            <div>
                                                <p className="font-medium">${asset.price.toLocaleString()}</p>
                                                <p className={`text-xs ${asset.change > 0 ? "text-emerald-300" : "text-rose-300"}`}>
                                                    {asset.change > 0 ? "+" : ""}{asset.change}%
                                                </p>
                                            </div>
                                            <button
                                                aria-label={isWatched ? `Remove ${asset.name} from watchlist` : `Add ${asset.name} to watchlist`}
                                                className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-slate-900"
                                                onClick={() => void handleWatchlistToggle(asset.id)}
                                                type="button"
                                            >
                                                {isWatched ? "Saved" : "Add"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {watchlistMessage && (
                            <p className="mt-3 text-sm text-emerald-200">{watchlistMessage}</p>
                        )}
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <h3 className="text-lg font-semibold">Market movers</h3>
                        <div className="mt-4 space-y-3">
                            {(marketInsights?.movers ?? []).map((mover) => (
                                <div className="flex items-center justify-between rounded-2xl bg-slate-950/40 p-3" key={mover.symbol}>
                                    <span>{mover.name} <span className="text-xs text-gray-400">{mover.symbol}</span></span>
                                    <span className={mover.change >= 0 ? "text-emerald-300" : "text-rose-300"}>{mover.change >= 0 ? "+" : ""}{mover.change}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <h3 className="text-lg font-semibold">Market news</h3>
                        <div className="mt-4 space-y-3">
                            {(marketInsights?.news ?? []).map((item) => (
                                <article className="rounded-2xl bg-slate-950/40 p-3" key={item.title}>
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="mt-1 text-xs text-gray-400">{item.source} · {item.sentiment}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-violet-500/20 to-blue-500/10 p-5">
                        <h3 className="text-lg font-semibold">Recent activity</h3>
                        <div className="mt-5 space-y-3">
                            {recentActivity.length > 0 ? recentActivity.map((entry) => (
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
                            )) : (
                                <p className="text-sm text-gray-300">No recent trades yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <h3 className="text-lg font-semibold">Transaction history</h3>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-slate-950/40 p-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Total trade volume</p>
                                <p className="mt-2 text-lg font-semibold text-white">${transactionAnalytics.totalVolume.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-950/40 p-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Avg trade</p>
                                <p className="mt-2 text-lg font-semibold text-white">${transactionAnalytics.averageTrade.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-950/40 p-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Buys</p>
                                <p className="mt-2 text-lg font-semibold text-emerald-300">{transactionAnalytics.buyCount}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-950/40 p-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Sells</p>
                                <p className="mt-2 text-lg font-semibold text-rose-300">{transactionAnalytics.sellCount}</p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            {transactions.length > 0 ? transactions.slice(0, 3).map((transaction) => (
                                <button key={transaction.id} className="w-full rounded-2xl bg-slate-950/40 p-3 text-left transition hover:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={() => setSelectedTransaction(transaction)} type="button">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${transaction.type === "buy" ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                                            {transaction.type}
                                        </span>
                                        <span className="text-xs text-gray-400">{new Date(transaction.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-200">
                                        {transaction.quantity} {transaction.symbol} for ${transaction.total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                                    </p>
                                </button>
                            )) : (
                                <p className="text-sm text-gray-300">No transactions yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold">Trade asset</h3>
                            <span className="text-xs uppercase tracking-[0.2em] text-blue-200">Demo portfolio</span>
                        </div>
                        <form className="mt-5 space-y-4" onSubmit={handleTrade}>
                            <div className="flex rounded-full border border-white/10 bg-slate-950/40 p-1" role="group" aria-label="Trade type">
                                {(["buy", "sell"] as TradeType[]).map((type) => (
                                    <button
                                        key={type}
                                        className={`flex-1 rounded-full px-3 py-2 text-sm font-medium capitalize transition ${tradeType === type ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"}`}
                                        onClick={() => setTradeType(type)}
                                        type="button"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <label className="block text-sm text-gray-300">
                                Asset
                                <select
                                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-blue-400"
                                    onChange={(event) => setSelectedAssetId(event.target.value as Asset["id"])}
                                    value={selectedAssetId}
                                >
                                    {portfolioAssets.map((asset) => (
                                        <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm text-gray-300">
                                Quantity
                                <input
                                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none focus:border-blue-400"
                                    min="0"
                                    onChange={(event) => setTradeQuantity(event.target.value)}
                                    placeholder="0.00"
                                    step="any"
                                    type="number"
                                    value={tradeQuantity}
                                />
                            </label>
                            {tradeError && <p className="text-sm text-rose-200" role="alert">{tradeError}</p>}
                            <button className="w-full rounded-full bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50" disabled={isMarketLoading} type="submit">
                                {isMarketLoading ? "Waiting for prices..." : `${tradeType === "buy" ? "Buy" : "Sell"} asset`}
                            </button>
                        </form>
                        {transactions.length > 0 && (
                            <div className="mt-5 border-t border-white/10 pt-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Latest trade</p>
                                <p className="mt-2 text-sm text-gray-200">
                                    <span className="font-semibold uppercase">{transactions[0].type}</span> {transactions[0].quantity} {transactions[0].symbol} for ${transactions[0].total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        )}
                    </div>
                </aside>
            </section>
            {pendingTrade && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-labelledby="trade-confirmation-title">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold" id="trade-confirmation-title">Confirm {pendingTrade.type}</h2>
                        <p className="mt-3 text-gray-300">{pendingTrade.quantity} {pendingTrade.asset.symbol} at ${pendingTrade.asset.price.toLocaleString()} each.</p>
                        <div className="mt-6 flex gap-3"><button className="flex-1 rounded-full border border-white/20 px-4 py-2" onClick={() => setPendingTrade(null)} type="button">Cancel</button><button className="flex-1 rounded-full bg-blue-600 px-4 py-2" onClick={() => void confirmTrade()} type="button">Confirm trade</button></div>
                    </div>
                </div>
            )}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-labelledby="transaction-detail-title">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold" id="transaction-detail-title">Transaction details</h2>
                        <dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-gray-400">Type</dt><dd>{selectedTransaction.type.toUpperCase()}</dd></div><div className="flex justify-between"><dt className="text-gray-400">Asset</dt><dd>{selectedTransaction.symbol}</dd></div><div className="flex justify-between"><dt className="text-gray-400">Quantity</dt><dd>{selectedTransaction.quantity}</dd></div><div className="flex justify-between"><dt className="text-gray-400">Total</dt><dd>${selectedTransaction.total.toLocaleString("en-US", { maximumFractionDigits: 2 })}</dd></div></dl>
                        <button className="mt-6 w-full rounded-full bg-blue-600 px-4 py-2" onClick={() => setSelectedTransaction(null)} type="button">Close</button>
                    </div>
                </div>
            )}
        </main>
    );
}