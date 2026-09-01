import { LuBitcoin } from "react-icons/lu";
import { FaEthereum } from "react-icons/fa";
import { FaLitecoinSign } from "react-icons/fa6";
import { CriptoArrayItems } from '@/types/CriptoArrayItems';

export const  criptoArray: CriptoArrayItems[] = [
    {
        icon: LuBitcoin,
        color: 'rgba(249, 170, 75, 1)',
        coinId: "bitcoin",
        short: "BTC",
        title: "Bitcoin",
    },
    {
        icon: FaEthereum,
        color: 'rgba(99, 116, 195, 1)',
        coinId: "ethereum",
        short: "ETH",
        title: "Ethereum",
    },
    {
        icon: FaLitecoinSign,
        color: 'rgba(89, 193, 156, 1)',
        coinId: "litecoin",
        short: "LTC",
        title: "Litecoin",
    },
];