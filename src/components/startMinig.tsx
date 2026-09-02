import Image from "next/image";
import Square from '../assets/img/square-3d.png'
import FormMining from "@/utils/FormMining";
import BitcoinIcon from "../assets/img/bitcoinIcon.png"

function StartMining() {
    return(
        <section id="Contact" className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 to-rgba-13-13-43-1">
            <div className="relative flex w-full max-w-6xl flex-col gap-8 overflow-hidden rounded-lg bg-blue-500 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12">
                <article className="z-10 flex max-w-md flex-col items-start gap-4">
                    <h3 className="font-rubik text-3xl font-bold leading-tight text-left text-white">
                        Start mining now
                    </h3>
                    <p className="text-base font-normal leading-7 text-left text-white">
                        Join now with CRAPPO to get the latest news and start mining now
                    </p>
                </article>
                <div className="z-10 w-full lg:w-auto"><FormMining /></div>
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