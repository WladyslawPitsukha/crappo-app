const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type TokenResponse = {
    access_token: string;
    token_type: string;
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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
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

export async function getBackendPortfolio(token: string): Promise<BackendPortfolio> {
    return request<BackendPortfolio>("/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function createBackendTrade(
    token: string,
    payload: { symbol: string; type: "buy" | "sell"; quantity: number; price_per_coin: number; total_value: number },
) {
    return request("/portfolio/transactions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
}

export async function upsertBackendHolding(
    token: string,
    payload: { symbol: string; name: string; quantity: number; average_cost: number; replace?: boolean },
) {
    return request("/portfolio/holdings", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
}