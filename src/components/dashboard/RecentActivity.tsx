import React, { type ReactNode } from "react";

export default function RecentActivity({ children }: { children: ReactNode }) {
    return <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-violet-500/20 to-blue-500/10 p-5"><h3 className="text-lg font-semibold">Recent activity</h3><div className="mt-5 space-y-3">{children}</div></section>;
}
