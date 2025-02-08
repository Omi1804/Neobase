import { MaxUint256 } from "ethers";
import { oftTokenABITransfer } from "@/data/tokenData";

export const approveToken = async ({
  selectedToken,
  tokenAmount,
  address,
  writeApprove,
  setTransactionStatus,
}: {
  selectedToken: any;
  tokenAmount: string;
  address: any;
  writeApprove: any;
  setTransactionStatus: (status: string) => void;
}) => {
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
