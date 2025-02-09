"use client";
import {
  coin98Wallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
  holesky,
} from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        coin98Wallet,
        coinbaseWallet,
      ],
    },
    {
      groupName: "More",
      wallets: [trustWallet, ledgerWallet, uniswapWallet],
    },
  ],
  { appName: "RainbowKit App", projectId: wcProjectId || "YOUR_PROJECT_ID" }
);

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, polygon, optimism, base, holesky],
  connectors: connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
    [polygon.id]: http("https://polygon-rpc.com"),
    [optimism.id]: http(),
    [base.id]: http(),
    [holesky.id]: http(),
  },

  ssr: true,
});
