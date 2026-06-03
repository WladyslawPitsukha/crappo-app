import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaBitcoin } from "react-icons/fa";
import { FaSquareXTwitter, FaCcMastercard } from "react-icons/fa6";
import { SiVisa } from "react-icons/si";
import { IconType } from "react-icons";

export type IconNetworks = {
    icon: IconType;
    link: string;
}

export const handleClick = (link: string): void => {
    window.open(link, '_blank');
}

export const iconsArray: IconNetworks[] = [
    {
        icon: FaFacebook,
        link: "https://www.facebook.com"
    },
    {
        icon: FaInstagram,
        link: "https://www.instagram.com"
    },
    {
        icon: FaYoutube,
        link: "https://www.vk.com"
    },
    {
        icon: FaLinkedin,
        link: "https://www.youtube.com"
    },
    {
        icon: FaSquareXTwitter,
        link: "https://www.twitter.com"
    },
];

export const paymentArray: IconNetworks[] = [
    {
        icon: SiVisa,
        link: "https://www.visa.com/"
    }, 
    {
        icon: FaCcMastercard,
        link: "https://www.mastercard.com/"
    },
    {
        icon: FaBitcoin,
        link: "https://bitpay.com/"
    }
];