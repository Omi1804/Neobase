"use client";
import React from "react";
import TransferHistory from "@/components/TransferHistory";
import { TransactionHeader } from "@/components/transactionHeader";
import TransferModal from "@/components/TransferModal";

const TokenTransferPage = () => {
  return (
    <div className="relative overflow-hidden bg-black bg-[url('/bg.png')] bg-no-repeat bg-cover bg-center h-screen overflow-y-auto">
      <TransactionHeader />
      <div className="z-10 flex flex-col items-center justify-center ">
        <TransferModal />
        <TransferHistory />
      </div>
    </div>
  );
};

export default TokenTransferPage;
