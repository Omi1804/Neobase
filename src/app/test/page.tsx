"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useChains, useReadContract } from "wagmi";
import oftTokenABI from "@/data/oftTokenABI.json";

//testing for transfer tokens
const page = () => {
  const chain = useChainId();
  const { address } = useAccount();

  const { data, isLoading } = useReadContract({
    // address: "0x6694340fc020c5e6b96567843da2df01b2ce1eb6",
    address: "0x6985884C4392D348587B19cb9eAAf157F13271cd",
    abi: oftTokenABI,
    functionName: "balanceOf",
    args: [address],
  });
  console.log("🚀 ~ page ~ data:", data);

  console.log(chain);

  return (
    <div>
      <h1 className="text-xl text-blue-400 text-center">Test Page</h1>
      <ConnectButton />
    </div>
  );
};

export default page;
