"use client";

import { useEffect, useMemo, useState } from "react";
import type { AssetId } from "@/data/assets";
import type { CoinMarketData } from "@/utils/coinGecko";

type AlertDirection = "above" | "below";
export type PriceAlert = { id: string; assetId: AssetId; target: number; direction: AlertDirection; triggered: boolean };

export function usePriceAlerts(userEmail: string | undefined, marketData: Record<AssetId, CoinMarketData> | null) {
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [notification, setNotification] = useState<string | null>(null);
    const storageKey = userEmail ? `crappo-price-alerts-${userEmail}` : null;

    useEffect(() => {
        if (!storageKey) return;
        try {
            const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as PriceAlert[];
            setAlerts(Array.isArray(stored) ? stored : []);
        } catch {
            setAlerts([]);
        }
    }, [storageKey]);

    useEffect(() => {
        if (!marketData || !storageKey) return;
        let changed = false;
        const next = alerts.map((alert) => {
            if (alert.triggered) return alert;
            const price = marketData[alert.assetId]?.price ?? 0;
            const triggered = alert.direction === "above" ? price >= alert.target : price <= alert.target;
            if (!triggered) return alert;
            changed = true;
            setNotification(`${alert.assetId} reached your $${alert.target.toLocaleString()} alert.`);
            return { ...alert, triggered: true };
        });
        if (changed) {
            setAlerts(next);
            localStorage.setItem(storageKey, JSON.stringify(next));
        }
    }, [alerts, marketData, storageKey]);

    const addAlert = (assetId: AssetId, target: number, direction: AlertDirection) => {
        if (!storageKey || !Number.isFinite(target) || target <= 0) return;
        const next = [...alerts, { id: `${Date.now()}-${assetId}`, assetId, target, direction, triggered: false }];
        setAlerts(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
    };

    const removeAlert = (id: string) => {
        const next = alerts.filter((alert) => alert.id !== id);
        setAlerts(next);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
    };

    const activeAlerts = useMemo(() => alerts.filter((alert) => !alert.triggered), [alerts]);
    return { alerts, activeAlerts, notification, setNotification, addAlert, removeAlert };
}