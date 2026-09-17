"use client";

import { useCallback, useEffect, useState } from "react";
import { createBackendTrade, getBackendPortfolio, upsertBackendHolding } from "@/utils/backendApi";

export type PortfolioHolding = { quantity: number; averageCost: number };
export type PortfolioTransaction = {
    id: string;
    type: "buy" | "sell";
    symbol: string;
    quantity: number;
    price: number;
    total: number;
    createdAt: string;
};

type TradeInput = {
    assetId: string;
    name: string;
    symbol: string;
    type: "buy" | "sell";
    quantity: number;
    price: number;
};

export function usePortfolio(userEmail?: string) {
    const [holdings, setHoldings] = useState<Record<string, PortfolioHolding>>({});
    const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);

    useEffect(() => {
        if (!userEmail) return;
        const key = `crappo-portfolio-${userEmail}`;
        try {
            const stored = JSON.parse(localStorage.getItem(key) ?? "{}") as { holdings?: Record<string, PortfolioHolding>; transactions?: PortfolioTransaction[] };
            setHoldings(stored.holdings ?? {});
            setTransactions(stored.transactions ?? []);
        } catch {
            setHoldings({});
            setTransactions([]);
        }

        void getBackendPortfolio().then((portfolio) => {
            const nextHoldings: Record<string, PortfolioHolding> = {};
            portfolio.holdings.forEach((holding) => {
                nextHoldings[holding.symbol.toLowerCase()] = { quantity: holding.quantity, averageCost: holding.average_cost };
            });
            const nextTransactions = portfolio.transactions.map((transaction) => ({
                id: String(transaction.id),
                type: transaction.type,
                symbol: transaction.symbol,
                quantity: transaction.quantity,
                price: transaction.price_per_coin,
                total: transaction.total_value,
                createdAt: transaction.created_at,
            }));
            setHoldings(nextHoldings);
            setTransactions(nextTransactions);
            localStorage.setItem(key, JSON.stringify({ holdings: nextHoldings, transactions: nextTransactions }));
        }).catch(() => undefined);
    }, [userEmail]);

    const persist = useCallback((nextHoldings: Record<string, PortfolioHolding>, nextTransactions: PortfolioTransaction[]) => {
        if (userEmail) localStorage.setItem(`crappo-portfolio-${userEmail}`, JSON.stringify({ holdings: nextHoldings, transactions: nextTransactions }));
    }, [userEmail]);

    const recordTrade = useCallback(async ({ assetId, name, symbol, type, quantity, price }: TradeInput) => {
        const current = holdings[assetId] ?? { quantity: 0, averageCost: 0 };
        if (type === "sell" && quantity > current.quantity) throw new Error(`You only hold ${current.quantity} ${symbol}.`);
        const nextQuantity = type === "buy" ? current.quantity + quantity : current.quantity - quantity;
        const nextAverageCost = type === "buy" ? ((current.quantity * current.averageCost) + (quantity * price)) / nextQuantity : nextQuantity > 0 ? current.averageCost : 0;
        const nextHoldings = { ...holdings };
        if (nextQuantity > 0) nextHoldings[assetId] = { quantity: nextQuantity, averageCost: nextAverageCost };
        else delete nextHoldings[assetId];
        const transaction: PortfolioTransaction = { id: `${Date.now()}-${assetId}`, type, symbol, quantity, price, total: quantity * price, createdAt: new Date().toISOString() };
        const nextTransactions = [transaction, ...transactions].slice(0, 20);
        setHoldings(nextHoldings);
        setTransactions(nextTransactions);
        persist(nextHoldings, nextTransactions);
        try {
            await createBackendTrade({ symbol, type, quantity, price_per_coin: price, total_value: transaction.total });
            await upsertBackendHolding({ symbol, name, quantity: nextQuantity, average_cost: nextAverageCost, replace: true });
        } catch {
            // The local record remains available while the backend is offline.
        }
    }, [holdings, persist, transactions]);

    return { holdings, transactions, recordTrade };
}
