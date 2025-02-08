"use client";
import React, { useState } from "react";
import { CircleArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const [started, setStarted] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-black relative">
      <div className="absolute inset-0">
        <img
          src="/bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="relative text-left flex flex-col items-centerborder space-y-2">
          <h1 className="text-8xl text-white font-normal capitalize">
            Welcome to
          </h1>
          <h1 className="text-8xl text-white font-bold capitalize">
            NeoBase Coding
          </h1>
          <div className="flex items-center gap-28">
            <h1 className="text-8xl text-white font-bold capitalize">Round</h1>
            <button
              onClick={() => router.push("/transfers")}
              className="bg-gradient-to-r from-[#0029FF] to-[#0000008e] hover:from-[#0000008e] hover:to-[#0029FF] duration-300 transition-colors rounded-full px-5 py-2 text-white font-bold text-lg flex items-center justify-center gap-2"
            >
              <CircleArrowRight size={20} />
              <span>Get Started</span>
            </button>
          </div>

          {/* blobs  */}

          <div className="w-28 h-28 absolute -top-[10%] right-[15%]">
            <img
              src="/home/coin.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-20 h-20 absolute top-[30%] left-[50%] animate-bounce">
            <img
              src="/home/coin2.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-36 h-36 absolute -bottom-[25%] left-[35%]">
            <img
              src="/home/shield.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
