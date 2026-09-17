import React, { type ReactNode } from "react";

export default function PerformanceChart({ children }: { children: ReactNode }) {
    return <section aria-label="Portfolio performance chart" className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">{children}</section>;
}
