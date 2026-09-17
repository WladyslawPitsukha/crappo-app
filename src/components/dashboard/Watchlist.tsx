import React, { type ReactNode } from "react";

export type WatchlistProps = {
    search: string;
    onSearchChange: (value: string) => void;
    children: ReactNode;
};

export default function Watchlist({ search, onSearchChange, children }: WatchlistProps) {
    return (
        <section className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Watchlist</h3><span className="text-xs uppercase tracking-[0.2em] text-blue-200">Live</span></div>
            <input aria-label="Search watchlist assets" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40" onChange={(event) => onSearchChange(event.target.value)} placeholder="Search coins" value={search} />
            <div className="mt-5 space-y-3">{children}</div>
        </section>
    );
}
