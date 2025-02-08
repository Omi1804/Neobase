import React, { useState } from "react";
import { bridgeTransactions } from "@/data/transactionData";

const BridgeTransferHistory = () => {
  const [hoveredTransactionId, setHoveredTransactionId]: any = useState(null);

  return (
    <div className="my-10 text-left w-full max-w-screen-md z-50">
      <h1 className="text-white font-bold text-base">Transactions</h1>

      <div className="backdrop-blur-sm bg-gradient-to-b from-black to-bg-black/30 rounded-2xl p-6 mt-4">
        {/* Header */}
        <div className="grid grid-cols-3 text-center">
          <h1 className="font-bold text-[#0029FF]">Transaction ID</h1>
          <h1 className="font-bold text-[#0029FF]">Transfer Amount</h1>
          <h1 className="font-bold text-[#0029FF]">Time</h1>
        </div>

        <div className="text-white mt-4 space-y-4">
          {bridgeTransactions.map((item: any) => (
            <div
              key={item.transaction_id}
              className="relative transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredTransactionId(item.transaction_id)}
              onMouseLeave={() => setHoveredTransactionId(null)}
            >
              <div className="grid grid-cols-3 text-center font-medium bg-black py-4 rounded-xl cursor-pointer transition-all duration-300 hover:rounded-b-none">
                <h1>{item.transaction_id}</h1>
                <h1>{item.transfer_amount}</h1>
                <h1>{item.date}</h1>
              </div>

              <div
                className={`w-full bg-black rounded-b-xl shadow-lg transition-all duration-500 ease-in-out overflow-hidden ${
                  hoveredTransactionId === item.transaction_id
                    ? "max-h-[100px] opacity-100 pb-4"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                <h1 className="text-gray-700 font-medium text-sm pl-20 mb-2">
                  Network
                </h1>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="text-xs flex items-center gap-2 justify-center">
                    <h1 className="text-[#FF00E1] font-bold">TO</h1>
                    <h1>{item.to}</h1>
                  </div>
                  <div className="text-xs flex items-center gap-2 justify-center">
                    <h1 className="text-[#FF00E1] font-bold">FROM</h1>
                    <h1>{item.from}</h1>
                  </div>
                  <div className="text-xs flex items-center gap-2 justify-center">
                    <h1 className="text-[#FF00E1] font-bold">TIME</h1>
                    <h1>{item.age}</h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BridgeTransferHistory;
