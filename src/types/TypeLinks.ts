import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaBitcoin } from "react-icons/fa";
import { FaSquareXTwitter, FaCcMastercard } from "react-icons/fa6";
import { SiVisa } from "react-icons/si";
import { IconType } from "react-icons";

export type IconNetworks = {
    icon: IconType;
    link: string;
    label: string;
}

export const iconsArray: IconNetworks[] = [
    {
        icon: FaFacebook,
        link: "https://www.facebook.com",
        label: "Facebook",
    },
    {
        icon: FaInstagram,
        link: "https://www.instagram.com",
        label: "Instagram",
    },
    {
        icon: FaYoutube,
        link: "https://www.vk.com",
        label: "YouTube",
    },
    {
        icon: FaLinkedin,
        link: "https://www.youtube.com",
        label: "LinkedIn",
    },
    {
        icon: FaSquareXTwitter,
        link: "https://www.twitter.com",
        label: "X",
    },
];

export const paymentArray: IconNetworks[] = [
    {
        icon: SiVisa,
        link: "https://www.visa.com/",
        label: "Visa",
    }, 
    {
        icon: FaCcMastercard,
        link: "https://www.mastercard.com/",
        label: "Mastercard",
    },
    {
        icon: FaBitcoin,
        link: "https://bitpay.com/",
        label: "Bitcoin payment",
    }
];