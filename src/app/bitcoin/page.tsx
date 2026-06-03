"use client"

import React from 'react';
import InfoPage from "@/components/infoPage";
import { infaBitcoin } from '@/types/TypeInfaSect';
import NavBar from '@/components/navBar';
import Footer from '@/components/footer';

const BitcoinPage: React.FC = () => {
    return(
        <div>
            <NavBar />
            <InfoPage 
                nameCri="Bitcoin"
                obj={infaBitcoin}
            />
            <Footer />
        </div>
    )
}

export default BitcoinPage;