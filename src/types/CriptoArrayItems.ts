import { IconType } from 'react-icons';

export type CriptoArrayItems = {
    icon: IconType;
    color: string;
    short: string;
    title: string;
    price: () => React.ReactNode;
    change: () => React.ReactNode;
    volume: () => React.ReactNode;
}