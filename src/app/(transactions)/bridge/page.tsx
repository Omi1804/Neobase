"use client";
import React, { useEffect, useState } from "react";
import { ArrowDown, ChevronDown, Loader2, Wallet } from "lucide-react";
import { selectToken } from "@/data/tokenData";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { useReadContract } from "wagmi";
import { ethers, parseUnits, MaxUint256 } from "ethers";
import { oftTokenABI } from "@/data/tokenData";
import { TransactionHeader } from "@/components/transactionHeader";
import BridgeTransferHistory from "@/components/BridgeTransferHistory";
import { toast } from "react-toastify";

const LZ_CHAIN_IDS = {
  POLYGON: 109,
  ARBITRUM: 110,
};

const EVM_CHAIN_IDS = {
  POLYGON: 137,
  ARBITRUM: 42161,
};

const Page = () => {
  const [selectedToken, setSelectedToken]: any = useState(null);
  const [showList, setShowList] = useState(false);
  const { address: myaddress, isConnected } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState("");
  const { switchChain } = useSwitchChain();
  const [amount, setAmount] = useState("");
  const chainId = useChainId();
  console.log("🚀 ~ Page ~ chainId:", chainId);

  const {
    writeContract: writeBridge,
    error: bridgeError,
    isPending: isBridgePending,
    isSuccess: isBridgeSuccess,
  } = useWriteContract();

  console.log("🚀 ~ Page ~ bridgeError:", bridgeError);

  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: selectedToken?.address,
    abi: oftTokenABI,
    functionName: "balanceOf",
    args: [myaddress],
  });

  console.log("🚀 ~ Page ~ balance:", tokenBalance);

  const handleBridge = async () => {
    if (!selectedToken || !amount || !myaddress) return;

    if (chainId !== EVM_CHAIN_IDS.POLYGON) {
      toast.error("Please switch to Polygon network");
      return;
    }

    try {
      const amountBN = parseUnits(amount, selectedToken.decimals);

      const addressAsBytes32 = ethers.zeroPadValue(recipientAddress, 32);

      const params = {
        _from: myaddress,
        _dstChainId: LZ_CHAIN_IDS.ARBITRUM,
        _toAddress: addressAsBytes32,
        _amount: amountBN,
        _minAmount: amountBN,
        _callParams: {
          refundAddress: myaddress,
          zroPaymentAddress: "0x0000000000000000000000000000000000000000",
          adapterParams: "0x",
        },
      };

      await writeBridge({
        address: selectedToken.address,
        abi: oftTokenABI,
        functionName: "sendFrom",
        args: [
          params._from,
          params._dstChainId,
          params._toAddress,
          params._amount,
          params._minAmount,
          params._callParams,
        ],
      });
    } catch (err) {
      console.error("Bridge error:", err);
    }
  };

  useEffect(() => {
    const checkAndSwitchChain = async () => {
      if (chainId && chainId !== 137 && isConnected) {
        try {
          await switchChain({ chainId: 137 });
          toast.success("Switched to Polygon network");
        } catch (error) {
          toast.error("Failed to switch network");
          console.error("Network switch error:", error);
        }
      }
    };

    checkAndSwitchChain();
  }, [chainId, isConnected, switchChain]);

  const isLoading = isBridgePending;

  return (
    <div className="relative overflow-hidden bg-black bg-[url('/bg.png')] bg-no-repeat bg-cover bg-center h-screen overflow-y-auto">
      <TransactionHeader />
      <div className="z-10 flex flex-col items-center justify-center ">
        <div className="text-center w-[400px] backdrop-blur-lg bg-gradient-to-b from-black to-bg-black/30 rounded-2xl p-6 shadow-2xl shadow-[#4200FF]">
          <h2 className="text-white text-left text-lg font-semibold">Bridge</h2>

          {/* Select Token Button */}
          <div className="relative mt-4">
            <button
              onClick={() => setShowList(!showList)}
              className="w-full flex items-center justify-between bg-black border border-gray-700 text-white px-4 py-2 rounded-md"
            >
              {selectedToken != null ? (
                <span className="flex items-center gap-2">
                  <img
                    src={selectedToken?.icon}
                    alt={selectedToken?.name}
                    className="w-5 h-5"
                  />
                  {selectedToken?.name}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-white">
                  Select Token
                </span>
              )}
              <ChevronDown size={16} />
            </button>
            {showList && (
              <div className="absolute w-full mt-2 bg-black rounded-md shadow-lg">
                {selectToken.map((token: any) => (
                  <div
                    key={token.id}
                    onClick={() => {
                      setSelectedToken(token);
                      setShowList(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                  >
                    <img
                      src={token.icon}
                      alt={token.name}
                      className="w-5 h-5"
                    />
                    <span>{token.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* From Section */}

          <div className="mt-4 ">
            <div className="bg-[#171717] p-3 rounded-2xl">
              <div className="flex gap-3 items-center text-gray-400 text-sm">
                <span>From</span>
                <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                  Polygon
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-white text-2xl bg-transparent outline-none border-none mt-2"
                  placeholder="0"
                />
                <button className="text-black text-xs bg-white px-2 py-1 rounded-md font-medium">
                  MAX
                </button>
              </div>
            </div>
            <div className="flex px-3 justify-between items-center text-gray-400 text-sm mt-2">
              {/* <span>
                Balance:{" "}
                {tokenBalance
                  ? ethers.parseUnits(tokenBalance, selectedToken.decimals)
                  : 0}
              </span> */}
            </div>
          </div>

          {/* Arrow Divider */}
          <div className="justify-center my-4 bg-white rounded-full p-1 inline-flex">
            <ArrowDown
              size={15}
              strokeWidth={4}
              className="text-black font-semibold"
            />
          </div>

          {/* To Section */}
          <div className="bg-[#171717] p-3 rounded-2xl">
            <div className="flex gap-3 items-center text-gray-400 text-sm">
              <span>From</span>
              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                Arbitrum
              </span>
            </div>

            <input
              type="text"
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full text-white text-2xl bg-transparent outline-none border-none mt-2"
              placeholder="0x7aB02D1...02b436c857"
            />
          </div>

          {/* Connect Wallet Button */}
          {isConnected ? (
            <button
              className="w-full mt-4 bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 shadow-sm shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleBridge}
              disabled={isLoading || !selectedToken || !amount}
            >
              {isBridgePending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Wallet size={18} color="white" />
              )}
              <span className="font-bold text-sm text-white">
                {isBridgePending ? "Bridging..." : "Bridge"}
              </span>
            </button>
          ) : (
            <button
              className="w-full mt-4 bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 shadow-sm shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              <Wallet size={18} color="white" />
              <span className="font-bold text-sm text-white">Not Connect</span>
            </button>
          )}
        </div>
        <BridgeTransferHistory />
      </div>
    </div>
  );
};

export default Page;
