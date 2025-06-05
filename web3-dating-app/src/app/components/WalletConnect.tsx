"use client";
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnect() {
  const { isConnected, address } = useAccount();
  return (
    <div className="text-center mt-10">
      <ConnectButton />
      {isConnected && <p className="mt-2 text-sm">Connected: {address}</p>}
    </div>
  );
}
