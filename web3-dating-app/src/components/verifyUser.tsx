"use client";

import { verifyUser } from "@/thirdweb/11155111/0x81b2d97830fa0e720c02052cd2aed5afe39fdafc";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, sendTransaction } from "thirdweb";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";
import { contract } from "@/app/client";

export default function VerifyUserButton({ userAddress }: { userAddress: string }) {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handleVerify = async () => {
    if (!account) {
      alert("Connect your wallet first");
      return;
    }

    const tx = verifyUser({
      contract,
      user: userAddress,
    });

    sendTransaction(tx)
  };

  return (
    <button onClick={handleVerify} disabled={isPending}>
      {isPending ? "Verifying..." : "Verify User"}
    </button>
  );
}
