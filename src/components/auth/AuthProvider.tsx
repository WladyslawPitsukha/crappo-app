"use client";

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getBackendProfile, loginWithBackend, logoutFromBackend, refreshBackendSession, registerWithBackend } from "@/utils/backendApi";

type User = {
    email: string;
};

type AuthContextValue = {
    isReady: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<string | null>;
    register: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                let profile;
                try {
                    profile = await getBackendProfile();
                } catch {
                    await refreshBackendSession();
                    profile = await getBackendProfile();
                }
                setUser({ email: profile.email });
            } catch {
                setUser(null);
            } finally {
                setIsReady(true);
            }
        };

        void restoreSession();
    }, []);

    const login = async (email: string, password: string) => {
        const normalizedEmail = email.toLowerCase();

        try {
            await loginWithBackend(normalizedEmail, password);
            setUser({ email: normalizedEmail });
            return null;
        } catch {
            return "Incorrect email or password.";
        }
    };

    const register = async (email: string, password: string) => {
        const normalizedEmail = email.toLowerCase();
        try {
            await registerWithBackend(normalizedEmail, password);
            setUser({ email: normalizedEmail });
            return null;
        } catch (error) {
            return error instanceof Error ? error.message : "Unable to create your account.";
        }
    };

    const logout = () => {
        void logoutFromBackend().catch(() => undefined);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isReady, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    return context;
}