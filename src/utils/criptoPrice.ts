export async function getBitcoinPrice(): Promise<number> {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    const price = Math.round(data.bitcoin.usd);

    return price;
}

export async function getEthereumPrice(): Promise<number> {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    const price = Math.round(data.ethereum.usd);

    return price;

}

export async function getLitecoinPrice(): Promise<number> {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
    const data = await response.json();
    const price = Math.round(data.litecoin.usd);

    return price;
}