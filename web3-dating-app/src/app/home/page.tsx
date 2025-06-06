"use client"; 

import React, { useState, useEffect} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ChainMatchLogo = "/chain-match-logo.png";
const myWallet = "1";
interface Match {
  wallet: string;
  fullName: string;
  age: number;
  city: string;
  imageUrl: string;
}

export default function Home() {
  const [allProfiles, setAllProfiles] = useState<Match[]>([]);
  const router = useRouter();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const currentProfile = allProfiles[currentProfileIndex];

    useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("/api/get-allusers");
        const users = await res.json();

        const filtered = users
          .filter((user: any) => user.wallet !== myWallet)
          .map((user: any) => {
            const dob = new Date(user.dob);
            const age =
              new Date().getFullYear() - dob.getFullYear();

            return {
              wallet: user.wallet,
              fullName: user.fullName,
              age,
              city: user.city,
              imageUrl: ``, 
            };
          });

        setAllProfiles(filtered);
      } catch (err) {
        console.error("Gagal mengambil profil:", err);
      }
    };

    fetchProfiles();
  }, []);

  const handleSwipe = async (direction: 'like' | 'dislike') => {
  console.log(`Swiped ${direction} on ${currentProfile?.fullName || 'unknown profile'}`);

  if (direction === 'like' && currentProfile) {
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdSaya: myWallet, 
          userIdPasangan: currentProfile.wallet.toString(),
        }),
      });

      const data = await response.json();
      console.log('Respon dari API Like:', data.message || data.error);
    } catch (err) {
      console.error('Gagal mengirim like:', err);
    }
  }

  if (currentProfileIndex < allProfiles.length - 1) {
    setCurrentProfileIndex(prev => prev + 1);
  } else {
    console.log("Tidak ada calon pasangan lain saat ini.");
    setCurrentProfileIndex(-1);
  }
};

  const handleGoToChatPage = () => {
    router.push('/chatlist');
    console.log("Navigasi ke Halaman Chat.");
  };

  return (
    <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background circles/blobs for neon effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content wrapper - centered by parent `main` */}
      {/* Uses flex-col and space-y for vertical stacking with minimal spacing */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full max-w-screen-lg h-full p-4"> {/* Adjusted height to full, added overall padding */}
        {/* Header section */}
        <Header />

        {/* Dynamic content: Profile Card or No More Matches Message */}
        <div className="flex-grow flex items-center justify-center w-full min-h-0"> {/* flex-grow to take available space */}
          {currentProfile ? (
            <MatchCard match={currentProfile} />
          ) : (
            <p className="text-white text-2xl font-bold text-center p-4" style={{ textShadow: "0 0 10px #00ffff" }}>
              Tidak ada calon pasangan lain saat ini. Coba lagi nanti!
            </p>
          )}
        </div>
        
        {/* Interaction Buttons - only show if there's a profile */}
        {currentProfile && (
            <InteractionButtons 
              onLike={() => handleSwipe('like')} 
              onDislike={() => handleSwipe('dislike')} 
            />
        )}

        {/* Navigation Button to Chat Page */}
        <ChatButton onGoToChat={handleGoToChatPage} />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-auto pt-4"> {/* Added pt-4 to push header down slightly */}
      {/* Chain Match Logo */}
      <Image
        src={ChainMatchLogo} 
        alt="Chain Match Logo"
        width={100} 
        height={100}
        className="size-[80px] md:size-[100px] mb-1 drop-shadow-2xl" 
        style={{
          filter: "drop-shadow(0px 0px 20px #ff00ff)", 
          background: 'radial-gradient(circle at center, rgba(255,0,255,0.4) 0%, transparent 70%)',
          borderRadius: '50%', 
        }}
      />

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-white text-center drop-shadow-lg"
                style={{ textShadow: "0 0 8px #ff00ff, 0 0 15px #00ffff" }}> {/* Neon text shadow */}
        Chain <span className="text-blue-400">Match</span>
      </h1>

      <p className="text-xs text-pink-300 text-center max-w-xs font-medium" // Reduced text size and max-width
         style={{ textShadow: "0 0 4px #ff00ff" }}> {/* Subtle neon text shadow */}
        Temukan koneksi Anda di blockchain.
      </p>
    </header>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div className="relative w-64 h-80 md:w-80 md:h-96 bg-gray-900 bg-opacity-70 rounded-xl shadow-2xl border border-pink-500 overflow-hidden neon-card-glow transform hover:scale-105 transition-all duration-200">
      <Image
        src={match.imageUrl}
        alt={match.fullName}
        layout="fill"
        objectFit="cover"
        className="rounded-t-xl"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
          const target = e.target as HTMLImageElement;
          target.onerror = null; 
          target.src = "https://placehold.co/400x500/6A0DAD/FFFFFF?text=No+Image"; 
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent rounded-b-xl">
        <h3 className="text-white text-xl md:text-2xl font-bold" style={{ textShadow: "0 0 8px #00ffff" }}>
          {match.fullName}, {match.age}
        </h3>
        <p className="text-pink-300 text-sm" style={{ textShadow: "0 0 5px #ff00ff" }}>
          {match.city}
        </p>
      </div>
    </div>
  );
}

interface InteractionButtonsProps {
  onLike: () => void; 
  onDislike: () => void; 
}

function InteractionButtons({ onLike, onDislike }: InteractionButtonsProps) {
  return (
    <div className="flex gap-8 mt-6 mb-auto"> {/* mb-auto to push up */}
      <button
        onClick={onDislike}
        className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-red-600 bg-opacity-80 text-white text-3xl md:text-4xl shadow-lg border border-red-500 hover:bg-red-700 transition-all duration-200 transform hover:scale-110 neon-button-shadow-red"
        style={{ textShadow: "0 0 10px #ff0000" }}
      >
        ✕
      </button>
      <button
        onClick={onLike}
        className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-green-600 bg-opacity-80 text-white text-3xl md:text-4xl shadow-lg border border-green-500 hover:bg-green-700 transition-all duration-200 transform hover:scale-110 neon-button-shadow-green"
        style={{ textShadow: "0 0 10px #00ff00" }}
      >
        ✓
      </button>
    </div>
  );
}

interface ChatButtonProps {
  onGoToChat: () => void; 
}

function ChatButton({ onGoToChat }: ChatButtonProps) {
  return (
    <button
      onClick={onGoToChat}
      className="py-2 px-6 md:py-3 md:px-8 text-sm md:text-base font-bold rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 neon-button-shadow mb-4"
    >
      Lihat Chat
    </button>
  );
}