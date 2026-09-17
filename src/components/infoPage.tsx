"use client"
import React, { lazy, Suspense, useMemo } from 'react';
import { TypeInfaSect } from "@/types/TypeInfaSect"
import "../style/coinPage.css"

export interface InfoPageProps {
    nameCri: string;
    obj: TypeInfaSect[];
}

function LazyGraphic({ component: Component }: { component: React.ComponentType }) {
    const DeferredGraphic = useMemo(() => lazy(() => Promise.resolve({ default: Component })), [Component]);

    return (
        <Suspense fallback={<div aria-label="Loading chart" className="h-[400px] w-full animate-pulse rounded-2xl bg-white/10" role="status" />}>
            <DeferredGraphic />
        </Suspense>
    );
}

const InfoPage: React.FC<InfoPageProps> = ({nameCri, obj}) => {
    return(
        <div className="flex flex-col items-center gap-12 justify-between px-4 py-10 sm:gap-20 sm:px-8 sm:py-20 lg:px-20">
            <h1 className="mb-1 text-center text-3xl font-bold text-white sm:text-4xl">
                Description of {nameCri}
            </h1>
            {obj.map((sect: TypeInfaSect, index: number) => (
                <div 
                    className={`flex flex-col items-stretch justify-around gap-8 lg:items-start lg:gap-20 ${index === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                    key={index}
                >
                    <LazyGraphic component={sect.graphic} />
                    <section className="history-section my-1 w-full rounded-lg bg-gray-800 p-5 sm:p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
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