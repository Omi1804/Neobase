"use client";
import { ChevronDown, Wallet, Loader2, Dot } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseUnits, MaxUint256 } from "ethers";
import { selectToken } from "@/data/tokenData";
import { oftTokenABITransfer } from "@/data/tokenData";
import TransferHistory from "@/components/TransferHistory";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { TransactionHeader } from "@/components/transactionHeader";

const TokenTransferPage = () => {
  const { address, isConnected } = useAccount();
  const [selectedToken, setSelectedToken]: any = useState(null);
  const [tokenAmount, setTokenAmount] = useState("");
  const [showList, setShowList] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [needsApproval, setNeedsApproval] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState("");

  // Contract write hooks
  const {
    writeContract: writeTransfer,
    error: transferError,
    isPending: isTransferPending,
    isSuccess: isTransferSuccess,
  } = useWriteContract();

  const {
    writeContract: writeApprove,
    error: approveError,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
  } = useWriteContract();

  // Check allowance
  const { data: allowance, refetch: refetchAllowance }: any = useReadContract({
    address: selectedToken?.address,
    abi: oftTokenABITransfer,
    functionName: "allowance",
    args:
      address && selectedToken ? [address, selectedToken.address] : undefined,
  });
  console.log("🚀 ~ TokenTransferPage ~ allowance:", allowance);

  useEffect(() => {
    if (selectedToken && tokenAmount && allowance !== undefined) {
      try {
        const amount = parseUnits(tokenAmount, selectedToken.decimals);
        setNeedsApproval(allowance < amount);
      } catch (err) {
        console.error("Error checking allowance:", err);
      }
    }
  }, [tokenAmount, allowance, selectedToken]);

  useEffect(() => {
    setTransactionStatus("");
  }, [selectedToken, tokenAmount]);

  useEffect(() => {
    if (isApproveSuccess) {
      setTransactionStatus("Approval successful! You can now transfer tokens.");
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  const handleApprove = async () => {
    if (!selectedToken || !tokenAmount || !address) return;

    try {
      setTransactionStatus("Initiating approval...");
      await writeApprove({
        address: selectedToken.address,
        abi: oftTokenABITransfer,
        functionName: "approve",
        args: [selectedToken.address, MaxUint256],
      });
    } catch (err) {
      console.error("Approval error:", err);
      setTransactionStatus("Approval failed. Please try again.");
    }
  };

  const handleTransfer = async () => {
    if (!selectedToken || !tokenAmount || !recipientAddress || !address) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setTransactionStatus("Initiating transfer...");
      const amount = parseUnits(tokenAmount, selectedToken.decimals);

      await writeTransfer({
        address: selectedToken.address,
        abi: oftTokenABITransfer,
        functionName: "transferFrom",
        args: [address, recipientAddress, amount],
      });

      if (isTransferSuccess) {
        setTransactionStatus("Transfer completed successfully!");
        setTokenAmount("");
        setRecipientAddress("");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      setTransactionStatus("Transfer failed. Please try again.");
    }
  };

  const isLoading = isTransferPending || isApprovePending;

  return (
    <div className="relative overflow-hidden bg-black bg-[url('/bg.png')] bg-no-repeat bg-cover bg-center h-screen overflow-y-auto">
      <TransactionHeader />
      <div className="z-10 flex flex-col items-center justify-center ">
        <div className="text-center w-[400px] backdrop-blur-lg bg-gradient-to-b from-black to-bg-black/30 rounded-2xl p-6 shadow-2xl shadow-[#4200FF] space-y-4">
          <h2 className="text-white text-left text-lg font-semibold">
            Transfer
          </h2>

          {/* Token Selector */}
          <div className="relative mt-4">
            <button
              onClick={() => setShowList(!showList)}
              className="w-full flex items-center justify-between bg-black border border-gray-700 text-white px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              {selectedToken ? (
                <span className="flex items-center gap-2">
                  <img
                    src={selectedToken.icon}
                    alt={selectedToken.name}
                    className="w-5 h-5"
                  />
                  {selectedToken.name}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-white">
                  Select Token
                </span>
              )}
              <ChevronDown size={16} />
            </button>

            {showList && (
              <div className="absolute w-full mt-2 bg-black rounded-md shadow-lg z-50">
                {selectToken.map((token) => (
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

          {/* Amount Input */}
          <div className="bg-[#171717] border border-gray-700 p-3 rounded-2xl text-left">
            <h1 className="px-4 text-gray-700">Total Amount to transfer</h1>
            <input
              type="text"
              pattern="^[0-9]*[.,]?[0-9]*$"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                setTokenAmount(value);
              }}
              value={tokenAmount}
              className="w-full my-2 px-4 bg-transparent border-none text-2xl outline-none text-white"
              placeholder="0.0"
              disabled={isLoading}
            />
          </div>

          {/* Recipient Address Input */}
          <div className="bg-[#171717] border border-gray-700 p-3 rounded-2xl text-left">
            <h1 className="px-4 text-gray-700">Recipient Address</h1>
            <input
              type="text"
              onChange={(e) => setRecipientAddress(e.target.value)}
              value={recipientAddress}
              className="w-full my-2 px-4 bg-transparent border-none text-2xl outline-none text-white placeholder:text-gray-600"
              placeholder="0xE58699......516d"
              disabled={isLoading}
            />
          </div>

          {/* Status Messages */}
          {transactionStatus && (
            <div
              className={`text-sm text-left ${
                transactionStatus.includes("failed")
                  ? "text-red-500"
                  : transactionStatus.includes("success")
                    ? "text-green-500"
                    : "text-white"
              }`}
            >
              {transactionStatus}
            </div>
          )}

          {(approveError || transferError) && (
            <div className="text-red-500 text-sm text-left">
              <p>Error Approval or Transfer</p>
            </div>
          )}

          {needsApproval ? (
            <button
              className="w-full mt-4 bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 shadow-sm shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleApprove}
              disabled={isLoading || !selectedToken || !tokenAmount}
            >
              {isApprovePending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Wallet size={18} />
              )}
              <span className="font-bold text-sm text-white">
                {isApprovePending ? "Approving..." : "Approve"}
              </span>
            </button>
          ) : (
            <button
              className="w-full mt-4 bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 shadow-sm shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleTransfer}
              disabled={
                isLoading || !selectedToken || !tokenAmount || !recipientAddress
              }
            >
              {isTransferPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Wallet size={18} />
              )}
              <span className="font-bold text-sm text-white">
                {isTransferPending ? "Processing..." : "Transfer"}
              </span>
            </button>
          )}
        </div>

        <TransferHistory />
      </div>
    </div>
  );
};

export default TokenTransferPage;
