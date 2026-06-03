import { LuBitcoin } from "react-icons/lu";
import { FaEthereum } from "react-icons/fa";
import { FaLitecoinSign } from "react-icons/fa6";
import { getBitcoinPrice, getEthereumPrice, getLitecoinPrice } from '../utils/criptoPrice';
import { CriptoArrayItems } from '@/types/CriptoArrayItems';
import { getBitcoinVolume, getEtrhreumVolume, getLitecoinVolume } from "./criptoVolume";
import { getBitcoinChange, getEthereumChange, getLitecoinChange } from "./criptoChange";

export const  criptoArray: CriptoArrayItems[] = [
    {
        icon: LuBitcoin,
        color: 'rgba(249, 170, 75, 1)',
        short: "BTC",
        title: "Bitcoin",
        price: () => getBitcoinPrice(),
        change: () => getBitcoinChange(),
        volume: () => getBitcoinVolume()
    },
    {
        icon: FaEthereum,
        color: 'rgba(99, 116, 195, 1)',
        short: "ETH",
        title: "Ethereum",
        price: () => getEthereumPrice(),
        change: () => getEthereumChange(),
        volume: () => getEtrhreumVolume()
    },
    {
        icon: FaLitecoinSign,
        color: 'rgba(89, 193, 156, 1)',
        short: "LTC",
        title: "Litecoin",
        price: () => getLitecoinPrice(),
        change: () => getLitecoinChange(),
        volume: () => getLitecoinVolume() 
    },
];