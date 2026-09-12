"use client"

import Header from "@/components/header"
import Footer from "@/components/Footer";
import WhyCrappo from "@/components/whyCrappo";
import NavBar from "@/components/navBar";
import TradeSecurely from "@/components/tradeSecurely";
import StartMining from "@/components/startMinig";
import Features from "@/components/features";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d2b] text-white">
      <NavBar />
      <main className="overflow-hidden">
        <Header />
        <WhyCrappo />
        <TradeSecurely />
        <Features />
        <StartMining />
        <Footer />
      </main>
    </div>
  );
}
