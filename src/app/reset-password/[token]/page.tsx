"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { confirmPasswordReset } from "@/utils/backendApi";

export default function ResetPasswordPage() {
    const params = useParams<{ token: string }>();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }
        try {
            await confirmPasswordReset(params.token, password);
            setMessage("Password updated. Redirecting to login...");
            window.setTimeout(() => router.push("/login"), 500);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Unable to update your password.");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
            <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
                <h1 className="text-3xl font-bold">Choose a new password</h1>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-sm text-slate-200" htmlFor="new-password">New password</label>
                    <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40" id="new-password" minLength={8} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    {message && <p className="rounded-xl bg-emerald-500/15 p-3 text-sm text-emerald-200" role="status">{message}</p>}
                    {error && <p className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-200" role="alert">{error}</p>}
                    <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300" type="submit">Update password</button>
                </form>
                <Link className="mt-6 inline-block text-sm text-blue-200 underline" href="/login">Back to login</Link>
            </section>
        </main>
    );
}
