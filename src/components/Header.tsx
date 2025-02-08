"use client";
import React from "react";
import { Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div className="fixed text-white top-0 w-full flex items-center justify-between px-10 py-6 z-50">
      {/* Logo */}
      <div className="w-6 h-6 cursor-pointer" onClick={() => router.push("/")}>
        <img
          src="/logo.png"
          alt="Neo Base"
          className="w-full h-full object-contain"
        />
      </div>

      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");
          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 border border-white/10 shadow-sm shadow-white/10"
                      type="button"
                    >
                      <Wallet color="white" size={18} />
                      <span className="font-bold text-sm text-white">
                        Connect Wallet
                      </span>
                    </button>
                  );
                }
                if (chain.unsupported) {
                  return (
                    <button
                      className="bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 border border-white/10 shadow-sm shadow-white/10"
                      onClick={openChainModal}
                      type="button"
                    >
                      Wrong network
                    </button>
                  );
                }
                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={openChainModal}
                      style={{ display: "flex", alignItems: "center" }}
                      type="button"
                      className="bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 border border-white/10 shadow-sm shadow-white/10"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                    <button
                      className="bg-gradient-to-r from-[#0029FF] to-[#000000] rounded-full px-5 py-2 flex items-center justify-center gap-2 border border-white/10 shadow-sm shadow-white/10"
                      onClick={openAccountModal}
                      type="button"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

export default Header;
