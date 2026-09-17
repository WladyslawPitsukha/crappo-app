"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
            <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6">
                <Link className="text-sm text-blue-200 underline" href="/dashboard">Back to dashboard</Link>
                <h1 className="mt-6 text-3xl font-bold">Account settings</h1>
                <div className="mt-6 space-y-4"><div className="rounded-2xl bg-slate-900/70 p-4"><p className="text-sm text-gray-400">Signed-in email</p><p className="mt-1 font-medium">{user?.email ?? "Not signed in"}</p></div><div className="rounded-2xl bg-slate-900/70 p-4"><p className="text-sm text-gray-400">Portfolio storage</p><p className="mt-1 font-medium">Backend synchronized with offline fallback</p></div></div>
            </section>
        </main>
    );
}