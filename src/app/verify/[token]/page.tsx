"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { verifyEmail } from "@/utils/backendApi";

export default function VerifyEmailPage() {
    const params = useParams<{ token: string }>();
    const [status, setStatus] = useState("Verifying your email...");
    const [error, setError] = useState("");

    useEffect(() => {
        void verifyEmail(params.token)
            .then(() => setStatus("Your email has been verified."))
            .catch((requestError: unknown) => {
                setError(requestError instanceof Error ? requestError.message : "Unable to verify your email.");
                setStatus("");
            });
    }, [params.token]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
            <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur">
                <h1 className="text-3xl font-bold">Email verification</h1>
                {status && <p className="mt-4 text-emerald-200" role="status">{status}</p>}
                {error && <p className="mt-4 text-rose-200" role="alert">{error}</p>}
                <Link className="mt-6 inline-block text-blue-200 underline" href="/login">Continue to login</Link>
            </section>
        </main>
    );
}
