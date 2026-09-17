const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type TokenResponse = {
    token_type: string;
};

export type BackendUser = {
    id: number;
    email: string;
    is_verified: boolean;
    role: string;
};

export type BackendPortfolio = {
    total_value: number;
    holdings: Array<{
        symbol: string;
        name: string;
        quantity: number;
        average_cost: number;
        value: number | null;
    }>;
    transactions: Array<{
        id: number;
        symbol: string;
        type: "buy" | "sell";
        quantity: number;
        price_per_coin: number;
        total_value: number;
        created_at: string;
    }>;
};

export type MarketInsights = {
    movers: Array<{ symbol: string; name: string; change: number }>;
    news: Array<{ title: string; source: string; sentiment: string }>;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error((await response.json().catch(() => null))?.detail ?? "Backend request failed.");
    }

    return response.json() as Promise<T>;
}

export async function registerWithBackend(email: string, password: string): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function loginWithBackend(email: string, password: string): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function getBackendProfile(): Promise<BackendUser> {
    return request<BackendUser>("/auth/profile");
}

export async function refreshBackendSession(): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/refresh", { method: "POST" });
}

export async function logoutFromBackend(): Promise<void> {
    await request<{ status: string }>("/auth/logout", { method: "POST" });
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/password-reset/request", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function confirmPasswordReset(token: string, password: string): Promise<void> {
    await request<{ status: string }>("/auth/password-reset/confirm", {
        method: "POST",
        body: JSON.stringify({ token, password }),
    });
}

export async function verifyEmail(token: string): Promise<void> {
    await request<{ status: string }>(`/auth/verify/${encodeURIComponent(token)}`);
}

export async function getBackendPortfolio(): Promise<BackendPortfolio> {
    return request<BackendPortfolio>("/portfolio");
}

export async function createBackendTrade(
    payload: { symbol: string; type: "buy" | "sell"; quantity: number; price_per_coin: number; total_value: number },
) {
    return request("/portfolio/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function upsertBackendHolding(
    payload: { symbol: string; name: string; quantity: number; average_cost: number; replace?: boolean },
) {
    return request("/portfolio/holdings", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getBackendWatchlist(): Promise<string[]> {
    return (await request<{ coin_ids: string[] }>("/watchlist")).coin_ids;
}

export async function addBackendWatchlistItem(coinId: string): Promise<string[]> {
    return (await request<{ coin_ids: string[] }>("/watchlist", { method: "POST", body: JSON.stringify({ coin_id: coinId }) })).coin_ids;
}

export async function removeBackendWatchlistItem(coinId: string): Promise<string[]> {
    return (await request<{ coin_ids: string[] }>(`/watchlist/${coinId}`, { method: "DELETE" })).coin_ids;
}

export async function getMarketInsights(): Promise<MarketInsights> {
    return request<MarketInsights>("/market/insights");
}