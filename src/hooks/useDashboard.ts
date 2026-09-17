"use client";

import React, { useCallback, useMemo, useState } from "react";
import { assetConfig, type AssetId } from "@/data/assets";
import { usePortfolio, type PortfolioTransaction } from "@/hooks/usePortfolio";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { CoinMarketData } from "@/utils/coinGecko";

export type DashboardAsset = {
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

type TradeType = "buy" | "sell";

export function useDashboard(userEmail: string | undefined, marketData: Record<AssetId, CoinMarketData> | null) {
    const { holdings, transactions, recordTrade } = usePortfolio(userEmail);
    const { watchlist, toggleWatchlist } = useWatchlist(userEmail);
    const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null);
    const [watchlistSearch, setWatchlistSearch] = useState("");
    const [pendingTrade, setPendingTrade] = useState<{ type: TradeType; asset: DashboardAsset; quantity: number } | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<PortfolioTransaction | null>(null);
    const [tradeType, setTradeType] = useState<TradeType>("buy");
    const [selectedAssetId, setSelectedAssetId] = useState<AssetId>("bitcoin");
    const [tradeQuantity, setTradeQuantity] = useState("");
    const [tradeError, setTradeError] = useState<string | null>(null);

    const portfolioAssets = useMemo<DashboardAsset[]>(() => {
        const pricedAssets = assetConfig.map((asset) => {
            const currentMarketData = marketData?.[asset.id];
            const holding = holdings[asset.id] ?? { quantity: 0, averageCost: 0 };
            return { ...asset, price: currentMarketData?.price ?? 0, change: currentMarketData?.change24h ?? 0, quantity: holding.quantity, averageCost: holding.averageCost, value: holding.quantity * (currentMarketData?.price ?? 0), allocation: 0, trend: (currentMarketData?.change24h ?? 0) >= 0 ? "up" as const : "down" as const };
        });
        const totalValue = pricedAssets.reduce((sum, asset) => sum + asset.value, 0);
        return pricedAssets.map((asset) => ({ ...asset, allocation: totalValue > 0 ? (asset.value / totalValue) * 100 : 0 }));
    }, [holdings, marketData]);

    const watchlistAssets = useMemo(() => {
        const ids = watchlist.length > 0 ? watchlist : assetConfig.map((asset) => asset.id);
        return ids.map((assetId) => {
            const assetMeta = assetConfig.find((asset) => asset.id === assetId) ?? assetConfig[0];
            const currentMarketData = marketData?.[assetId];
            return { ...assetMeta, price: currentMarketData?.price ?? 0, change: currentMarketData?.change24h ?? 0, value: 0, quantity: 0, averageCost: 0, allocation: 0, trend: (currentMarketData?.change24h ?? 0) >= 0 ? "up" as const : "down" as const };
        });
    }, [marketData, watchlist]);

    const searchableAssets = useMemo(() => assetConfig.filter((asset) => `${asset.name} ${asset.symbol}`.toLowerCase().includes(watchlistSearch.toLowerCase())), [watchlistSearch]);
    const portfolioValue = useMemo(() => portfolioAssets.reduce((sum, asset) => sum + asset.value, 0), [portfolioAssets]);
    const investedValue = useMemo(() => portfolioAssets.reduce((sum, asset) => sum + asset.quantity * asset.averageCost, 0), [portfolioAssets]);
    const transactionAnalytics = useMemo(() => {
        const totalVolume = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
        return { totalVolume, averageTrade: transactions.length > 0 ? totalVolume / transactions.length : 0, buyCount: transactions.filter((transaction) => transaction.type === "buy").length, sellCount: transactions.filter((transaction) => transaction.type === "sell").length, activeAssets: new Set(transactions.map((transaction) => transaction.symbol)).size };
    }, [transactions]);
    const recentActivity = useMemo(() => transactions.slice(0, 4).map((transaction) => ({ type: transaction.type, coin: transaction.symbol, value: `${transaction.type === "buy" ? "+" : "-"}${transaction.quantity} ${transaction.symbol}`, time: new Date(transaction.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) })), [transactions]);
    const recommendations = useMemo(() => {
        const leader = [...portfolioAssets].sort((a, b) => b.allocation - a.allocation)[0];
        const strongestMover = [...portfolioAssets].sort((a, b) => b.change - a.change)[0];
        const items: string[] = [];
        if (leader?.allocation > 70) items.push(`Consider diversifying beyond ${leader.symbol}; it represents ${leader.allocation.toFixed(0)}% of your portfolio.`);
        if (strongestMover && strongestMover.change > 0) items.push(`${strongestMover.symbol} is your strongest current mover at +${strongestMover.change.toFixed(2)}%.`);
        if (transactions.length === 0) items.push("Add your first position to start tracking portfolio performance.");
        return items;
    }, [portfolioAssets, transactions.length]);

    const handleWatchlistToggle = useCallback(async (assetId: AssetId) => {
        const asset = assetConfig.find((item) => item.id === assetId);
        if (!asset) return;
        const wasWatched = watchlist.includes(assetId);
        setWatchlistMessage(wasWatched ? `${asset.name} was removed from your watchlist.` : `${asset.name} is in your watchlist.`);
        await toggleWatchlist(assetId);
    }, [toggleWatchlist, watchlist]);

    const handleTrade = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const quantity = Number(tradeQuantity);
        const selectedAsset = portfolioAssets.find((asset) => asset.id === selectedAssetId);
        const currentHolding = holdings[selectedAssetId] ?? { quantity: 0, averageCost: 0 };
        if (!selectedAsset || !Number.isFinite(quantity) || quantity <= 0 || selectedAsset.price <= 0) return setTradeError("Enter a valid quantity after market data has loaded.");
        if (tradeType === "sell" && quantity > currentHolding.quantity) return setTradeError(`You only hold ${currentHolding.quantity} ${selectedAsset.symbol}.`);
        setPendingTrade({ type: tradeType, asset: selectedAsset, quantity });
    }, [holdings, portfolioAssets, selectedAssetId, tradeQuantity, tradeType]);

    const confirmTrade = useCallback(async () => {
        if (!pendingTrade) return;
        const { asset, quantity, type } = pendingTrade;
        await recordTrade({ assetId: asset.id, name: asset.name, symbol: asset.symbol, type, quantity, price: asset.price });
        setTradeQuantity("");
        setTradeError(null);
        setPendingTrade(null);
    }, [pendingTrade, recordTrade]);

    return { holdings, transactions, watchlist, watchlistAssets, searchableAssets, watchlistMessage, watchlistSearch, setWatchlistSearch, handleWatchlistToggle, portfolioAssets, portfolioValue, investedValue, portfolioPnl: portfolioValue - investedValue, recentActivity, transactionAnalytics, recommendations, pendingTrade, setPendingTrade, selectedTransaction, setSelectedTransaction, tradeType, setTradeType, selectedAssetId, setSelectedAssetId, tradeQuantity, setTradeQuantity, tradeError, handleTrade, confirmTrade };
}
