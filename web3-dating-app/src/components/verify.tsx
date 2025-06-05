"use client";
import { useEffect, useState } from "react";
import { checkIfUserIsVerified } from "../app/client";

type VerifyProps = {
  userAddress: string;
};

export default function Verify({ userAddress }: VerifyProps) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      const result = await checkIfUserIsVerified(userAddress);
      setVerified(result);
    };

    if (userAddress) {
      checkVerification();
    }
  }, [userAddress]);

  return (
    <div>
      User verified:{" "}
      {verified === null ? "Checking..." : verified ? "Yes" : "No"}
    </div>
  );
}
