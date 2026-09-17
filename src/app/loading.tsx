export default function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white" aria-busy="true">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-200" role="status">Loading Crappo...</div>
        </main>
    );
}
