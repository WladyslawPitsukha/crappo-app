import '../style/hoverAnima.css'
import LogoImg from '../assets/img/Logo.png'
import Logo from './logo'
import { propsNavBar } from '@/types/PropsNavBar'
import HandleScroll from '@/utils/handleScroll'

export default function NavBar() {
    const activeSection = HandleScroll();

    return (
        <section className="flex justify-between items-center sticky top-0 left-0 z-50 navColor">
            <Logo logo={LogoImg} />
            <article className="flex items-center gap-14">
                <div className="flex items-center gap-8">
                    {propsNavBar.map((obj, index) => (
                        <h4 
                            key={index} 
                            className="text-base font-normal leading-7 tracking-tight text-left text-white border-b"
                            onClick={obj.onClick}
                        >
                            {obj.title}
                        </h4>
                    ))}
                </div>
                <div className="flex items-center">
                    <button className="flex justify-center items-center w-40 h-12 p-4 rounded-full hover:bg-blue-600 transition duration-300">
                        <h5 className="text-white w-auto">Login</h5>
                    </button>
                    <div className="h-12 w-0 border-l border-gray-300 mx-6"></div>
                    <button className="flex w-40 justify-center items-center h-12 p-4 rounded-full  hover:bg-blue-600 transition duration-300">
                        <h5 className="w-auto text-white">Register</h5>
                    </button>
                </div>
            </article>
        </section>
    )
}
