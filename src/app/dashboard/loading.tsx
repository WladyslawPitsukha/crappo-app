export default function DashboardLoading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white" aria-busy="true">
            <div className="w-full max-w-md space-y-3" role="status">
                <div className="h-10 animate-pulse rounded-2xl bg-white/10" />
                <div className="h-32 animate-pulse rounded-3xl bg-white/10" />
                <p className="text-center text-sm text-slate-300">Loading dashboard...</p>
            </div>
        </main>
    );
}
