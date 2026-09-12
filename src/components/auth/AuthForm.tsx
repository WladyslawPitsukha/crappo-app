"use client";

import React from "react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

type AuthMode = "login" | "register";

export default function AuthForm({ mode }: { mode: AuthMode }) {
    const { login, register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const isRegister = mode === "register";

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        const authError = isRegister ? register(email, password) : login(email, password);

        if (authError) {
            setError(authError);
            return;
        }

        router.push("/dashboard");
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(180deg,#0d0d2b_0%,#141c40_100%)] px-4 py-12 sm:px-6">
            <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.38)] sm:p-8">
                <div className="mb-6 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                    {isRegister ? "Create account" : "Welcome back"}
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{isRegister ? "Create account" : "Welcome back"}</h1>
                <p className="mt-2 text-sm text-slate-600">
                    {isRegister ? "Create an account to access your dashboard." : "Sign in to access your dashboard."}
                </p>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                        <input
                            aria-invalid={Boolean(error && !email)}
                            aria-describedby={error ? "auth-form-error" : undefined}
                            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                        <input
                            aria-invalid={Boolean(error && password.length > 0)}
                            aria-describedby={error ? "auth-form-error" : undefined}
                            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isRegister ? "new-password" : "current-password"}
                            minLength={8}
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" id="auth-form-error" role="alert">{error}</p>}
                    <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300" type="submit">
                        {isRegister ? "Register" : "Login"}
                    </button>
                </form>
                <p className="mt-6 text-sm text-slate-600">
                    {isRegister ? "Already have an account?" : "Need an account?"}{" "}
                    <Link className="font-medium text-blue-700 underline" href={isRegister ? "/login" : "/register"}>
                        {isRegister ? "Login" : "Register"}
                    </Link>
                </p>
            </section>
        </main>
    );
}