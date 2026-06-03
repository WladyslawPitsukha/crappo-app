import { getBitcoinPrice, getEthereumPrice, getLitecoinPrice } from "./criptoPrice";

const previousPrices = {
    bitcoin: null as number | null,
    ethereum: null as number | null,
    litecoin: null as number | null
}

function calculateChange(prevPrice: number | null, curPrice: number): string {
    if (prevPrice === null) {
        return "Fail";
    }
    const change = ((curPrice - prevPrice) / prevPrice) * 100;
    if (change > 0) {
        return `+${change.toFixed(2)}%`;
    } else if (change < 0) {
        return `-${Math.abs(change).toFixed(2)}%`;
    } else {
        return "Price didn't change";
    }
}

export async function getBitcoinChange() {
    const price = await getBitcoinPrice();
    const change = calculateChange(previousPrices.bitcoin, price);

    previousPrices.bitcoin = price;
    return change;
}

export async function getEthereumChange() {
    const price = await getEthereumPrice();
    const change = calculateChange(previousPrices.ethereum, price);
    
    previousPrices.ethereum = price;
    return change;
}

export async function getLitecoinChange() {
    const price = await getLitecoinPrice();
    const change = calculateChange(previousPrices.litecoin, price);
    previousPrices.litecoin = price;

    return change;
}