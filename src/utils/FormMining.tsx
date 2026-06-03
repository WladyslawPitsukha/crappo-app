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
        <form onSubmit={handleSubmit} className="flex items-center gap-10 justify-between ">
            <input 
                type="text"
                value={email}
                onChange={handleEmailChange}
                className=""
                placeholder="Enter your email"
            />
            <button
                type="submit"
                className="rounded-full bg-white w-40 h-14 px-3 py-[14px] inputButHover"
            >
                <p className="w-auto h-auto text-center text-base font-medium leading-7 text-gray-900">
                    Subscribe
                </p>
            </button>
        </form>
    )
}