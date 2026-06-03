import Image from "next/image";
import Square from '../assets/img/square-3d.png'
import FormMining from "@/utils/FormMining";
import BitcoinIcon from "../assets/img/bitcoinIcon.png"

function StartMining() {
    return(
        <section id="Contact" className="flex flex-col justify-center items-center bg-gradient-to-b from-purple-800 to-rgba-13-13-43-1">
            <div className="flex items-center justify-between bg-blue-500 rounded-lg p-12 relative overflow-hidden gap-12">
                <article className="flex flex-col items-start gap-4">
                    <h3 className="font-rubik text-white text-3xl font-bold leading-12 text-left">
                        Start mining now
                    </h3>
                    <p className="text-white text-base font-normal leading-7 tracking-tighter text-left w-[348px]">
                        Join now with CRAPPO to get the latest news and start mining now
                    </p>
                </article>
                <FormMining />
                <Image 
                    src={Square} 
                    alt="square" 
                    className="absolute -top-11 left-6 w-auto h-auto"
                />
                <Image 
                    src={BitcoinIcon}
                    alt="bitcoinIcon"
                    className="absolute bottom-0 right-4 w-auto h-auto"
                />
            </div>
        </section>
    )
}

export default StartMining;