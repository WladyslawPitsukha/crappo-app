"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardPage() {
    const { isReady, logout, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isReady && !user) {
            router.replace("/login");
        }
    }, [isReady, router, user]);

    if (!isReady || !user) {
        return <main className="p-8 text-white">Loading...</main>;
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-300">Signed in as {user.email}</p>
                    <h1 className="mt-2 text-4xl font-bold">Your dashboard</h1>
                </div>
                <button
                    className="rounded border border-white px-4 py-2 font-medium hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => {
                        logout();
                        router.push("/");
                    }}
                    type="button"
                >
                    Logout
                </button>
            </div>
            <section className="rounded-lg bg-white/10 p-6">
                <h2 className="text-2xl font-semibold">Market overview</h2>
                <p className="mt-2 text-gray-200">Your saved account is ready for the market-data dashboard.</p>
                <Link className="mt-5 inline-block font-medium text-blue-300 underline" href="/">Return home</Link>
            </section>
        </main>
    );
}