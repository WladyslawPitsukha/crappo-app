"use client"
import React from 'react';
import { TypeInfaSect } from "@/types/TypeInfaSect"
import "../style/coinPage.css"

export interface InfoPageProps {
    nameCri: string;
    obj: TypeInfaSect[];
}

const InfoPage: React.FC<InfoPageProps> = ({nameCri, obj}) => {
    return(
        <div className="flex flex-col items-center gap-20 justify-between p-20">
            <h1 className="text-4xl font-bold text-center text-white mb-1">
                Description of {nameCri}
            </h1>
            {obj.map((sect: TypeInfaSect, index: number) => (
                <div 
                    className={`flex ${index === 1 ? 'flex-row-reverse' : ''} items-start justify-around gap-20`}
                    key={index}
                >
                    {<sect.graphic />}
                    <section className="history-section p-8 bg-gray-800 rounded-lg my-1 w-full">
                        <h2 className="text-3xl font-semibold text-white mb-4">
                            {sect.info.title}
                        </h2>
                        <p className="text-gray-300">
                            {sect.info.text1}
                        </p>
                        <br />
                        <p className="text-gray-300">
                            {sect.info.text2}
                        </p>
                        <br />
                        <p className="text-gray-300">
                            {sect.info.text3}
                        </p>
                    </section>
                </div>
            ))}
        </div>
    )
}

export default InfoPage;