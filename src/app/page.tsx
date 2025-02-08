"use client";
import React from "react";
import { CircleArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-black relative">
      <div className="absolute inset-0">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="relative flex flex-col items-start space-y-4 px-4 text-left">
          <h1 className="text-4xl sm:text-6xl md:text-8xl text-white font-normal capitalize text-left">
            Welcome to
          </h1>
          <h1 className="text-4xl sm:text-6xl md:text-8xl text-white font-bold capitalize">
            NeoBase Coding
          </h1>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-28">
            <h1 className="text-4xl sm:text-6xl md:text-8xl text-white font-bold capitalize">
              Round
            </h1>
            <button
              onClick={() => router.push("/transfers")}
              className="bg-gradient-to-r from-[#0029FF] to-[#0000008e] hover:from-[#0000008e] hover:to-[#0029FF] duration-300 transition-colors rounded-full px-4 py-2 sm:px-5 sm:py-2 text-white font-bold text-lg flex items-center justify-center gap-2"
            >
              <CircleArrowRight size={20} />
              <span>Get Started</span>
            </button>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 absolute -top-10 sm:-top-12 md:-top-[10%] right-4 sm:right-8 md:right-[15%]">
            <img
              src="/home/coin.png"
              alt="Coin"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 absolute top-12 sm:top-16 md:top-[30%] left-1/2 transform -translate-x-1/2 animate-bounce">
            <img
              src="/home/coin2.png"
              alt="Coin 2"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 absolute -bottom-12 sm:-bottom-16 md:-bottom-[25%] left-1/3 sm:left-[35%]">
            <img
              src="/home/shield.png"
              alt="Shield"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
