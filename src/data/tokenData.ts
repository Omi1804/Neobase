export const selectToken = [
  {
    id: 1,
    name: "Stargate",
    symbol: "STG",
    icon: "/stargate.jpg",
    address: "0x6694340fc020c5E6B96567843da2df01b2CE1eb6",
    decimals: 18,
  },
  {
    id: 2,
    name: "LayerZero",
    symbol: "ZRo",
    icon: "/zro.avif",
    address: "0x6985884C4392D348587B19cb9eAAf157F13271cd",
    decimals: 18,
  },
];

export const oftTokenABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },

  {
    inputs: [
      { name: "_from", type: "address" },
      { name: "_dstChainId", type: "uint16" },
      { name: "_toAddress", type: "bytes32" },
      { name: "_amount", type: "uint256" },
      { name: "_minAmount", type: "uint256" },
      {
        name: "_callParams",
        type: "tuple",
        components: [
          { name: "refundAddress", type: "address" },
          { name: "zroPaymentAddress", type: "address" },
          { name: "adapterParams", type: "bytes" },
        ],
      },
    ],
    name: "sendFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Balance check
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Allowance check
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const oftTokenABITransfer = [
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
