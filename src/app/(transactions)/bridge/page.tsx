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
  const { address, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const [amount, setAmount] = useState("");
  const chainId = useChainId();
  const [needsApproval, setNeedsApproval] = useState(true);
  console.log("🚀 ~ Page ~ chainId:", chainId);

  const {
    writeContract: writeApprove,
    error: approveError,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
  } = useWriteContract();

  const {
    writeContract: writeBridge,
    error: bridgeError,
    isPending: isBridgePending,
    isSuccess: isBridgeSuccess,
  } = useWriteContract();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: selectedToken?.address,
    abi: oftTokenABI,
    functionName: "balanceOf",
    args: [address],
  });

  // Check allowance
  const { data: allowance, refetch: refetchAllowance }: any = useReadContract({
    address: selectedToken?.address,
    abi: oftTokenABI,
    functionName: "allowance",
    args:
      address && selectedToken ? [address, selectedToken.address] : undefined,
  });

  // Check if approval is needed
  useEffect(() => {
    if (selectedToken && amount && allowance !== undefined) {
      try {
        const amountBN: any = parseUnits(amount, selectedToken.decimals);
        setNeedsApproval(allowance < amountBN);
      } catch (err) {
        console.error("Error checking allowance:", err);
      }
    }
  }, [amount, allowance, selectedToken]);

  const handleApprove = async () => {
    if (!selectedToken || !amount || !address) return;

    try {
      await writeApprove({
        address: selectedToken.address,
        abi: oftTokenABI,
        functionName: "approve",
        // @ts-ignore
        args: [selectedToken.address, MaxUint256],
      });
    } catch (err) {
      console.error("Approval error:", err);
    }
  };
  const handleBridge = async () => {
    if (!selectedToken || !amount || !address) return;

    // Check if on correct source chain (Polygon)
    if (chainId !== EVM_CHAIN_IDS.POLYGON) {
      try {
        // @ts-ignore
        await switchChain?.({ chainId: EVM_CHAIN_IDS.POLYGON });
        return;
      } catch (err) {
        console.error("Failed to switch network:", err);
        return;
      }
    }

    try {
      const amountBN = parseUnits(amount, selectedToken.decimals);

      const addressAsBytes32 = ethers.zeroPadValue(address, 32);

      const params = {
        _from: address,
        _dstChainId: LZ_CHAIN_IDS.ARBITRUM,
        _toAddress: addressAsBytes32,
        _amount: amountBN,
        _minAmount: amountBN,
        _callParams: {
          refundAddress: address,
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

  const isLoading = isApprovePending || isBridgePending;

  return (
    <div className="relative overflow-hidden bg-black bg-[url('/bg.png')] bg-no-repeat bg-cover bg-center h-screen overflow-y-auto">
      <TransactionHeader />
      <div className="z-10 flex flex-col items-center justify-center ">
        <div className="relative top-10 text-center w-[400px] backdrop-blur-lg bg-gradient-to-b from-black to-bg-black/30 rounded-2xl p-6 shadow-2xl shadow-[#4200FF]">
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
              <span>Balance: 0</span>
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
              type="number"
              className="w-full text-white text-2xl bg-transparent outline-none border-none mt-2"
              placeholder="0"
            />
          </div>

          {/* Connect Wallet Button */}
          {isConnected ? (
            needsApproval ? (
              <button
                className="w-full mt-4 bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 shadow-sm shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleApprove}
                disabled={isLoading || !selectedToken || !amount}
              >
                {isApprovePending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Wallet size={18} color="white" />
                )}
                <span className="font-bold text-sm text-white">
                  {isApprovePending ? "Approving..." : "Approve"}
                </span>
              </button>
            ) : (
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
            )
          ) : (
            <button
              className="w-full mt-4 bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 shadow-sm shadow-white/10"
              onClick={() => {
                /* Add your wallet connect logic here */
              }}
            >
              <Wallet color="white" size={18} />
              <span className="font-bold text-sm text-white">
                Connect Wallet
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
