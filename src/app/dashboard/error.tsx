"use client";

import { useEffect } from "react";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error("Dashboard error", error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
            <section className="w-full max-w-md rounded-3xl border border-rose-400/30 bg-rose-500/10 p-8 text-center">
                <h1 className="text-2xl font-bold">Dashboard unavailable</h1>
                <p className="mt-3 text-sm text-rose-100">Your session or market data could not be loaded.</p>
                <button className="mt-6 rounded-full bg-white px-5 py-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300" onClick={() => reset()} type="button">Reload dashboard</button>
            </section>
        </main>
    );
}
