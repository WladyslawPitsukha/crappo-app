"use client";

import React, { useState } from "react";
import '../style/inputText.css';

export default function FormMining() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [hasError, setHasError] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setMessage('');
        setHasError(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !e.currentTarget.checkValidity()) {
            setMessage('Enter a valid email address.');
            setHasError(true);
            return;
        }

        setEmail('');
        setMessage('Thanks, you are on the list.');
        setHasError(false);
    }

    return(
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
            <input 
                aria-describedby="mining-form-message"
                required
                type="email"
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
            {message && (
                <p
                    className={hasError ? "text-sm text-red-100" : "text-sm text-white"}
                    id="mining-form-message"
                    role={hasError ? "alert" : "status"}
                >
                    {message}
                </p>
            )}
        </form>
    )
}