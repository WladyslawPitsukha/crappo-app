"use client"

import InfoPage from "@/components/infoPage";
import "../../style/coinPage.css";
import Footer from "@/components/Footer";
import NavBar from "@/components/navBar";
import { infaLitecoin } from "@/types/TypeInfaSect";

const LitecoinPage = () => {
    return(
        <div>
            <NavBar />
            <InfoPage 
                nameCri="Litecoin"
                obj={infaLitecoin}
            />
            <Footer />
        </div>
    )
}

export default LitecoinPage;