"use client";

import React, { useState } from "react";
import { sendTransaction, waitForReceipt} from "thirdweb";
import { parseEther } from "ethers";
import { sepolia } from "thirdweb/chains";
import { client } from "@/app/client";


interface SendEthButtonProps {
  account: any;
  recipient: string;
}

export default function SendEthButton({ account, recipient }: SendEthButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const txResult = await sendTransaction({
        transaction: {
          client: client,
          to: recipient,
          chain: sepolia,
          value: parseEther(amount),
        },
        account: account,
      });

      await waitForReceipt(txResult);
      setSuccess("Transaction successful!");
    } catch (err) {
      console.error(err);
      setError("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Send ETH
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Send ETH</h2>
            <p className="mb-2 text-sm text-gray-600">To: {recipient}</p>
            <input
              type="number"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-black"
            />
            {loading && <p className="text-blue-500 mb-2">Sending...</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={handleSend}
                disabled={loading || !amount}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
