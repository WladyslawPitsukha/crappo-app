import React, { useState } from "react";
import '../style/inputText.css';

export default function FormMining() {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setEmail('')
    }

    return(
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
            <input 
                type="text"
                value={email}
                onChange={handleEmailChange}
                className="h-14 w-full border-b border-white bg-transparent px-1 text-white outline-none placeholder:text-white/75 focus-visible:ring-2 focus-visible:ring-white sm:min-w-64"
                placeholder="Enter your email"
            />
            <button
                type="submit"
                className="h-14 w-full rounded-full bg-white px-3 py-[14px] sm:w-40 inputButHover"
            >
                <p className="w-auto h-auto text-center text-base font-medium leading-7 text-gray-900">
                    Subscribe
                </p>
            </button>
        </form>
    )
}