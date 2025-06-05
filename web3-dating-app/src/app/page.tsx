"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg"; // Assuming you still want to use this icon for branding
import { client } from "./client";

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 flex flex-col items-center">
        <Header />

        <div className="flex flex-col items-center mb-8">
          <p className="text-zinc-300 text-lg mb-4 text-center">
            Connect your wallet to find your perfect match!
          </p>
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Chain Match", // Dating app name
              url: "https://web3love.com", // Your dating app URL
            }}
          />
        </div>

        <HowItWorks />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-12 md:mb-16">
      <Image
        src={thirdwebIcon} // You might want to replace this with a dating app specific logo
        alt="Web3Love Logo"
        className="size-[120px] md:size-[150px] mb-4"
        style={{
          filter: "drop-shadow(0px 0px 24px #e91e63a8)", // Pinkish shadow for dating app theme
        }}
      />

      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-zinc-100 text-center">
        Chain<span className="text-pink-500">Match</span>
      </h1>

      <p className="text-zinc-300 text-base text-center max-w-md">
        The decentralized dating app where connections are made on the blockchain.
      </p>
    </header>
  );
}

function HowItWorks() {
  return (
    <div className="mt-16 w-full max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-100 text-center mb-8">
        How it Works
      </h2>
      <div className="grid gap-6 md:grid-cols-3 justify-center">
        <ArticleCard
          title="1. Connect Your Wallet"
          description="Securely log in with your preferred crypto wallet. No personal data required."
          icon="💖" // Heart emoji
        />

        <ArticleCard
          title="2. Create Your Profile"
          description="Build your on-chain profile with your interests and preferences."
          icon="✨" // Sparkles emoji
        />

        <ArticleCard
          title="3. Find Your Match"
          description="Discover compatible profiles and start building meaningful connections."
          icon="💘" // Heart with arrow emoji
        />
      </div>
    </div>
  );
}

function ArticleCard(props: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col items-center text-center border border-zinc-800 p-6 rounded-lg hover:bg-zinc-900 transition-colors hover:border-pink-700 h-full">
      <div className="text-5xl mb-4">{props.icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-zinc-100">{props.title}</h3>
      <p className="text-sm text-zinc-400">{props.description}</p>
    </div>
  );
}