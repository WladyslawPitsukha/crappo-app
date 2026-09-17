export const assetConfig = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "litecoin", name: "Litecoin", symbol: "LTC" },
] as const;

export type AssetId = (typeof assetConfig)[number]["id"];