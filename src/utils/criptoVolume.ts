import { getBitcoinPrice, getEthereumPrice, getLitecoinPrice } from "./criptoPrice";

export async function getBitcoinVolume(): Promise<number> {
    const price = await getBitcoinPrice();
    const volume = Math.round(price * 24);

    return volume;
}

export async function getEtrhreumVolume(): Promise<number> {
    const price = await getEthereumPrice();
    const volume = Math.round(price * 24);

    return volume;
} 

export async function getLitecoinVolume(): Promise<number> {
    const price = await getLitecoinPrice();
    const volume = Math.round(price * 24);

    return volume;
} 