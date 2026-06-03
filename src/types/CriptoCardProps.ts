import { LuBitcoin } from "react-icons/lu";
import { FaEthereum} from "react-icons/fa";
import { FaLitecoinSign } from "react-icons/fa6";
import { IconType } from "react-icons";
import Link from "next/link";

export type CriptoCardProps = {
    id: number;
    img: IconType;
    title: string;
    text: string;
    symbol: string;
    link: string;
}

export const criptoCardArray: CriptoCardProps[] = [
    {
        id: 1,
        img: LuBitcoin,
        title: "Bitcoin",
        text: "Digital currency in which a record of transactions is maintained.",
        symbol: "BTC",
        link: "/bitcoin"
    },
    {   
        id: 2,
        img: FaEthereum,
        title: "Ethereum",
        text: "Blockchain technology to create and run decentralized digital applications.",
        symbol: "ETH",
        link: "/ethereum"
    },
    {
        id: 3,
        img: FaLitecoinSign,
        title: "Litecoin",
        text: "Cryptocurrency that enables instant payments to anyone in the world.",
        symbol: "LTC",
        link: "/litecoin"
    }
];