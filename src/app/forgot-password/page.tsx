"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/utils/backendApi";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        try {
            const response = await requestPasswordReset(email);
            setMessage(response.message);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Unable to request a password reset.");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
            <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
                <h1 className="text-3xl font-bold">Reset password</h1>
                <p className="mt-2 text-sm text-slate-300">Enter your account email to receive reset instructions.</p>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-sm text-slate-200" htmlFor="reset-email">Email</label>
                    <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40" id="reset-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    {message && <p className="rounded-xl bg-emerald-500/15 p-3 text-sm text-emerald-200" role="status">{message}</p>}
                    {error && <p className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-200" role="alert">{error}</p>}
                    <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300" type="submit">Send reset instructions</button>
                </form>
                <Link className="mt-6 inline-block text-sm text-blue-200 underline" href="/login">Back to login</Link>
            </section>
        </main>
    );
}
