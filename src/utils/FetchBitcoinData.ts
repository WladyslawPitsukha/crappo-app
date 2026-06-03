import axios from "axios";

export interface BitcoinData {
    bitcoin: {
        usd: number;
    };
}

export async function FetchBitcoinData(): Promise<BitcoinData | null> {
    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const bitcoinData: BitcoinData = response.data;
        return bitcoinData;
    } catch (error) {
        console.error('Error fetching Bitcoin data: ', error);
        return null;
    }
}