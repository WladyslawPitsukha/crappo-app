import BitcoinChart from "@/app/bitcoin/components/BitcoinChart";
import BitcoinGraphic from "@/app/bitcoin/components/BitcoinGraphic";
import BitcoinRingChart from "@/app/bitcoin/components/BitcoinRingChart";
import EthereumChart from "@/app/ethereum/components/EthereumChart";
import EthereumGraphic from "@/app/ethereum/components/EthereumGraphic";
import EthereumRingChart from "@/app/ethereum/components/EthereumRingChart";
import LitecoinChart from "@/app/litecoin/components/LitecoinChart";
import LitecoinGraphic from "@/app/litecoin/components/LitecoinGraphic";
import LitecoinRingChart from "@/app/litecoin/components/LitecoinRingChart";

export type ObjectInfo = {
    title: string;
    text1: string;
    text2: string;
    text3: string;
}

export type TypeInfaSect = {
    graphic: React.FC<{}>;
    info: ObjectInfo;
}

export const infaBitcoin: TypeInfaSect[] = [
    {
        graphic: BitcoinGraphic,
        info: {
            title: "History of creation",
            text1: "Bitcoin was created in 2009 by a person or group of people under the pseudonym Satoshi Nakamoto. It is the first decentralized digital currency that allowed users to make transactions directly without intermediaries.",
            text2: "Satoshi Nakamoto published a white paper describing how Bitcoin works in 2008. The paper outlined the basics of the blockchain technology that powers Bitcoin. In 2010, Satoshi handed over control of the source code to other developers and disappeared from public view. Since then, Bitcoin has become the basis for many other cryptocurrencies and inspired the development of decentralized financial systems around the world. In 2017, Bitcoin achieved significant success when its price surpassed the $20,000 mark, attracting the attention of both institutional and retail investors.",
            text3: "The creation of Bitcoin was a response to the global financial crisis of 2008. Satoshi Nakamoto aimed to create a system that would be independent of central banks and governments. The first Bitcoin transaction occurred in January 2009, when Satoshi sent 10 BTC to Hal Finney. In 2010, the famous purchase of two pizzas for 10,000 BTC took place, which became the first real use of Bitcoin as a currency."
        }
    },
    {
        graphic: BitcoinRingChart,
        info: {
            title: "Future Predictions",
            text1: "Bitcoin is most popular in countries such as the United States, Canada, Japan, and South Korea. These countries are actively developing blockchain and cryptocurrency technologies.",
            text2: "In the future, Bitcoin is expected to be integrated into various financial systems and become a part of everyday life. Some analysts predict that Bitcoin could become digital gold, serving as a safe haven for investors in times of economic instability. Recently, there has been an increase in interest in Bitcoin from large corporations and financial institutions such as Tesla and Square, which have begun investing in the cryptocurrency. This could further strengthen Bitcoin's position in the global financial market. In addition, the development of second-layer technologies such as the Lightning Network could significantly increase the speed and reduce the cost of transactions on the Bitcoin network.",
            text3: "Experts suggest that in the future, Bitcoin may become a global reserve currency, competing with the US dollar. It is expected that the development of smart contract technology based on Bitcoin (for example, RSK) will allow for the creation of more complex financial instruments. Some analysts predict that by 2030, the price of Bitcoin could reach $500,000 per coin. However, there are also risks associated with potential tightening of cryptocurrency regulations in different countries"
        }
    },
    {
        graphic: BitcoinChart,
        info: {
            title: "Popular Countries",
            text1: "In the future, Bitcoin is expected to continue to grow in popularity and be used as an alternative means of investment and payment. Many experts predict further increases in value and adoption in various sectors of the economy.",
            text2: "In some countries, such as Venezuela and Argentina, Bitcoin has become a popular store of value amid hyperinflation and economic crises. In other countries, such as Switzerland, Bitcoin is used to facilitate international transfers and reduce transaction costs. In advanced economies, such as the United States and Japan, Bitcoin is becoming part of the retail industry and is used as a means of payment in various online and offline stores. At the same time, governments in some countries, such as China, have expressed concerns about the use of cryptocurrencies and are imposing restrictions on their use, highlighting the complexity of regulating this new financial technology.",
            text3: "In El Salvador, Bitcoin was recognized as legal tender in 2021, which became the first case of such recognition at the state level. In Ukraine and Georgia, Bitcoin is actively used for international transfers and as a means of savings. In Nigeria and other African countries, Bitcoin helps overcome the limitations of the traditional banking system. At the same time, in Russia and India, the attitude towards Bitcoin remains ambiguous, with periodic attempts to restrict its use."
        }
    },
]

export const infaEthereum: TypeInfaSect[] = [
    {
        graphic: EthereumGraphic,
        info: {
            title: "History of Creation",
            text1: "Ethereum was created by Vitalik Buterin in 2015. It is the first blockchain platform that allowed the development and deployment of smart contracts and decentralized applications.",
            text2: "Buterin published the Ethereum white paper in 2013, describing the concept of a platform for creating decentralized applications. In 2014, a crowdsale was conducted to fund the development. Ethereum quickly became the second most popular cryptocurrency after Bitcoin and the foundation for many projects in the decentralized finance (DeFi) sphere.",
            text3: "The creation of Ethereum was motivated by the desire to expand blockchain capabilities beyond simple transactions. The first Ethereum block was mined on July 30, 2015. In 2016, the famous DAO hack occurred, which led to a hard fork and the creation of Ethereum Classic."
        }
    },
    {
        graphic: EthereumRingChart,
        info: {
            title: "Future Predictions",
            text1: "Ethereum is most popular in countries with developed technological infrastructure, such as the USA, Germany, Singapore, and Switzerland.",
            text2: "In the future, Ethereum is expected to become the foundation for Web 3.0 and the decentralized internet. The transition to Ethereum 2.0 with the Proof-of-Stake consensus mechanism should significantly increase the scalability and energy efficiency of the network. Many analysts predict that Ethereum's market capitalization may surpass Bitcoin in the future (the so-called 'flippening').",
            text3: "Experts predict that Ethereum will continue to lead in the DeFi and NFT sectors. The development of layer-two solutions such as Optimism and Arbitrum is expected to increase network throughput. Some analysts suggest that by 2030, the price of ETH could reach $50,000."
        }
    },
    {
        graphic: EthereumChart,
        info: {
            title: "Popular Countries",
            text1: "Ethereum is widely used in many countries around the world, especially in those where fintech and blockchain technologies are actively developing.",
            text2: "In the USA, Ethereum is popular among institutional investors and DeFi project developers. In Switzerland, especially in the 'Crypto Valley' of Zug canton, Ethereum is actively used in various blockchain startups. In Singapore, Ethereum is the basis for many fintech innovations and is supported by the government.",
            text3: "In Germany, Ethereum is used in asset tokenization projects. In Canada, Ethereum is popular among miners and developers. In Japan, Ethereum is widely used in the gaming industry and NFT projects. In Estonia, Ethereum is used in government digital initiatives."
        }
    },
];

export const infaLitecoin: TypeInfaSect[] = [
    {
        graphic: LitecoinGraphic,
        info: {
            title: "History of Creation",
            text1: "Litecoin was created by Charlie Lee in 2011 as a 'lite' version of Bitcoin. The goal was to create a cryptocurrency that would be faster and more accessible for everyday transactions.",
            text2: "Lee, a former employee of Google and Coinbase, launched Litecoin on October 7, 2011. Litecoin was created based on Bitcoin's source code but with several key changes, including the use of the Scrypt algorithm for mining and increased block generation speed.",
            text3: "Litecoin quickly became one of the leading alternatives to Bitcoin. In 2017, Litecoin became the first major cryptocurrency to implement SegWit (Segregated Witness), which significantly improved network scalability. Litecoin is often called the 'silver' in the cryptocurrency world, where Bitcoin is considered 'gold'."
        }
    },
    {
        graphic: LitecoinRingChart,
        info: {
            title: "Future Predictions",
            text1: "Litecoin is most popular in countries with high levels of cryptocurrency adoption, such as the USA, South Korea, and the UK.",
            text2: "In the future, Litecoin is expected to maintain its position as a fast and inexpensive alternative to Bitcoin for everyday transactions. The development of Lightning Network technology on Litecoin could further increase transaction speed and reduce fees. Some analysts suggest that Litecoin could become a popular means of micropayments on the internet.",
            text3: "Experts predict that Litecoin will continue to follow Bitcoin's trends but with less volatility. The implementation of MimbleWimble Extension Blocks (MWEB) is expected to increase transaction privacy in the Litecoin network. Some analysts predict that by 2025, the price of LTC could reach $1,000."
        }
    },
    {
        graphic: LitecoinChart,
        info: {
            title: "Popular Countries",
            text1: "Litecoin has global distribution but is especially popular in countries with developed cryptocurrency infrastructure.",
            text2: "In the USA, Litecoin is widely accepted by many online stores and services. In South Korea, Litecoin is popular among traders due to high liquidity on local exchanges. In the UK, Litecoin is often used for international transfers due to low fees.",
            text3: "In Japan, Litecoin is popular among retail investors. In Germany, Litecoin is used as an alternative to traditional payment systems in some online services. In Australia, Litecoin is accepted by many cryptocurrency ATMs. In Canada, Litecoin is popular among miners due to relatively low hardware requirements."
        }
    },
];