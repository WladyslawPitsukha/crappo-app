'use client'

import React, { useState } from "react";
import '../style/hoveranima.css'
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import LogoImg from '../assets/img/Logo.png'
import Logo from './logo'
import { propsNavBar } from '@/types/PropsNavBar'
import { useAuth } from "./auth/AuthProvider";

export default function NavBar() {
    const { logout, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 left-0 z-50 border-b border-white/10 bg-[rgba(13,13,43,0.92)] px-4 py-4 backdrop-blur-xl md:px-8 lg:px-16">
            <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4" aria-label="Main navigation">
                <Logo logo={LogoImg} />
                <button
                    aria-controls="main-navigation-links"
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white outline-none ring-offset-2 ring-offset-[#0d0d2b] focus-visible:ring-2 focus-visible:ring-blue-300 md:hidden"
                    onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                    type="button"
                >
                    {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                </button>
                <div
                    className={`${isMenuOpen ? "flex" : "hidden"} w-full flex-col items-stretch gap-5 border-t border-white/10 pt-5 md:flex md:w-auto md:flex-row md:items-center md:gap-10 md:border-0 md:pt-0`}
                    id="main-navigation-links"
                >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
                        {propsNavBar.map((item) => (
                            <Link
                                className="rounded py-2 text-base font-normal text-gray-200 outline-none transition hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-300 md:py-1"
                                href={item.href}
                                key={item.title}
                                onClick={closeMenu}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {user ? (
                            <>
                                <Link className="flex h-12 items-center justify-center rounded-full border border-white/30 px-5 text-white outline-none transition hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300" href="/dashboard" onClick={closeMenu}>Dashboard</Link>
                                <button className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-5 text-white outline-none transition hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300" onClick={() => { logout(); closeMenu(); }} type="button">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link className="flex h-12 items-center justify-center rounded-full border border-white/30 px-5 text-white outline-none transition hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300" href="/login" onClick={closeMenu}>Login</Link>
                                <Link className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-5 text-white outline-none transition hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300" href="/register" onClick={closeMenu}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}
