import { descArray, DescProps } from "@/types/DescProps";
import '../style/hoverAnima.css'

const Description: React.FC<DescProps> = ({id}) => {
    const item = descArray.find(item => item.id === id);

    if(!item) {
        return null;
    }

    return (
        <div className="mt-10 flex w-full max-w-md flex-col items-start">
            <h2 className="text-3xl font-bold leading-tight text-left text-white sm:text-4xl">
                {item.title}
            </h2>
            <p className="text-base font-normal leading-[28px] tracking-[0.01em] text-left text-gray-300 mt-4 w-auto">
                {item.desc}
            </p>
            <button
                className="custom-button bg-blue-500 text-white mt-4 rounded-full px-8 py-4 hoverButton"
                onClick={() => {}}
            >
                <h6 className="font-rubik text-lg font-medium leading-[27px] text-center">
                    Learn More
                </h6>
            </button>
        </div>
    )
}

export default Description;