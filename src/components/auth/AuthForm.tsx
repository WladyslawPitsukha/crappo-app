"use client";

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
        <main className="flex min-h-screen items-center justify-center px-6 py-12">
            <section className="w-full max-w-md rounded-lg bg-white p-8 text-slate-900 shadow-xl">
                <h1 className="text-3xl font-bold">{isRegister ? "Create account" : "Welcome back"}</h1>
                <p className="mt-2 text-sm text-slate-600">
                    {isRegister ? "Create an account to access your dashboard." : "Sign in to access your dashboard."}
                </p>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium" htmlFor="email">Email</label>
                        <input
                            aria-invalid={Boolean(error && !email)}
                            aria-describedby={error ? "auth-form-error" : undefined}
                            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                        <label className="block text-sm font-medium" htmlFor="password">Password</label>
                        <input
                            aria-invalid={Boolean(error && password.length > 0)}
                            aria-describedby={error ? "auth-form-error" : undefined}
                            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                    {error && <p className="text-sm text-red-700" id="auth-form-error" role="alert">{error}</p>}
                    <button className="w-full rounded bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300" type="submit">
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