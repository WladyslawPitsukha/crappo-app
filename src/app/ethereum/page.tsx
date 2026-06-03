"use client"

import InfoPage from "@/components/infoPage";
import "../../style/coinPage.css";
import Footer from "@/components/footer";
import NavBar from "@/components/navBar";
import { infaEthereum } from "@/types/TypeInfaSect";

const EthereumPage = () => {
    return(
        <div>
            <NavBar />
            <InfoPage 
                nameCri="Ethereum"
                obj={infaEthereum}
            />
            <Footer />
        </div>
    )
}

export default EthereumPage;