import { IconType } from 'react-icons';
import { CoinId } from '@/utils/coinGecko';

export type CriptoArrayItems = {
    icon: IconType;
    color: string;
    coinId: CoinId;
    short: string;
    title: string;
}