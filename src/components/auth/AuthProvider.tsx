"use client";

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
    email: string;
};

type StoredUser = User & {
    password: string;
};

type AuthContextValue = {
    isReady: boolean;
    user: User | null;
    login: (email: string, password: string) => string | null;
    register: (email: string, password: string) => string | null;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USERS_KEY = "crappo-demo-users";
const SESSION_KEY = "crappo-demo-session";

function getStoredUsers(): StoredUser[] {
    const storedUsers = localStorage.getItem(USERS_KEY);

    if (!storedUsers) {
        return [];
    }

    try {
        return JSON.parse(storedUsers) as StoredUser[];
    } catch {
        return [];
    }
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedSession = localStorage.getItem(SESSION_KEY);

        if (storedSession) {
            try {
                setUser(JSON.parse(storedSession) as User);
            } catch {
                localStorage.removeItem(SESSION_KEY);
            }
        }

        setIsReady(true);
    }, []);

    const createSession = (email: string) => {
        const nextUser = { email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
    };

    const login = (email: string, password: string) => {
        const matchingUser = getStoredUsers().find(
            (storedUser) => storedUser.email === email.toLowerCase() && storedUser.password === password,
        );

        if (!matchingUser) {
            return "Incorrect email or password.";
        }

        createSession(matchingUser.email);
        return null;
    };

    const register = (email: string, password: string) => {
        const normalizedEmail = email.toLowerCase();
        const users = getStoredUsers();

        if (users.some((storedUser) => storedUser.email === normalizedEmail)) {
            return "An account with this email already exists.";
        }

        localStorage.setItem(USERS_KEY, JSON.stringify([...users, { email: normalizedEmail, password }]));
        createSession(normalizedEmail);
        return null;
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
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