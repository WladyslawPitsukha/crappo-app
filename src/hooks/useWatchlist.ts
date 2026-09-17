"use client";

import { useCallback, useEffect, useState } from "react";
import { addBackendWatchlistItem, getBackendWatchlist, removeBackendWatchlistItem } from "@/utils/backendApi";
import type { AssetId } from "@/data/assets";

export function useWatchlist(userEmail?: string) {
    const [watchlist, setWatchlist] = useState<AssetId[]>([]);

    useEffect(() => {
        if (!userEmail) return;
        const key = `crappo-watchlist-${userEmail}`;
        try {
            const local = JSON.parse(localStorage.getItem(key) ?? "[]") as AssetId[];
            setWatchlist(Array.isArray(local) ? local : []);
        } catch {
            setWatchlist([]);
        }
        void getBackendWatchlist().then((remote) => {
            const next = remote.filter((id): id is AssetId => ["bitcoin", "ethereum", "litecoin"].includes(id));
            setWatchlist(next);
            localStorage.setItem(key, JSON.stringify(next));
        }).catch(() => undefined);
    }, [userEmail]);

    const toggleWatchlist = useCallback(async (assetId: AssetId) => {
        const key = `crappo-watchlist-${userEmail}`;
        const next = watchlist.includes(assetId) ? watchlist.filter((id) => id !== assetId) : [...watchlist, assetId];
        setWatchlist(next);
        localStorage.setItem(key, JSON.stringify(next));
        try {
            const remote = watchlist.includes(assetId) ? await removeBackendWatchlistItem(assetId) : await addBackendWatchlistItem(assetId);
            const synced = remote.filter((id): id is AssetId => ["bitcoin", "ethereum", "litecoin"].includes(id));
            setWatchlist(synced);
            localStorage.setItem(key, JSON.stringify(synced));
        } catch {
            // Local state remains usable while the API is offline.
        }
    }, [userEmail, watchlist]);

    return { watchlist, toggleWatchlist };
}