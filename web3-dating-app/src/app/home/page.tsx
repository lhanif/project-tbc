"use client"; // This directive is necessary for Next.js App Router client components

import React, { useState } from "react"; // Import useState
import Image from "next/image";

// Assuming you have your Chain Match logo image in the public folder.
// Replace this with the actual path to your logo.
const ChainMatchLogo = "/chain-match-logo.png"; // Example path to your logo

// Placeholder images for match cards. Replace with actual image URLs if available.
// For now, using placeholder service.
const placeholderProfileImage1 = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbanggaikep.go.id%2Fportal%2Fkabar-gembira-presiden-ri-jokowi-bakal-kunjungi-bangkep%2F&psig=AOvVaw3b86MRFtBFdekpNsA-ZhMU&ust=1749193640404000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLilu57c2Y0DFQAAAAAdAAAAABAE";
const placeholderProfileImage2 = "https://placehold.co/400x500/00FFFF/FF00FF?text=Another+Match";
const placeholderProfileImage3 = "https://placehold.co/400x500/FF00FF/00FFFF?text=New+Match";


// Define an interface for MatchCard props (optional but good practice)
interface Match {
  id: number;
  name: string;
  age: number;
  city: string;
  imageUrl: string;
}

export default function Home() {
  // Array of potential profiles
  const [allProfiles, setAllProfiles] = useState<Match[]>([
    { id: 1, name: "Luna", age: 26, city: "Cyber City", imageUrl: "" },
    { id: 2, name: "Astro", age: 28, city: "Neon District", imageUrl: "" },
    { id: 3, name: "Kira", age: 24, city: "Data Stream", imageUrl: "" },
    // Add more profiles here for demonstration
  ]);

  // Index of the currently displayed profile
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  // Get the current profile to display
  const currentProfile = allProfiles[currentProfileIndex];

  // Function to handle like/dislike (swiping)
  const handleSwipe = (direction: 'like' | 'dislike') => {
    console.log(`Swiped ${direction} on ${currentProfile?.name || 'unknown profile'}`);

    // In a real app:
    // - Send 'like'/'dislike' data to a backend/smart contract for currentProfile.id
    // - Implement matching logic (if both liked, add to chat list)

    // Move to the next profile
    if (currentProfileIndex < allProfiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // No more profiles, reset or load more
      console.log("Tidak ada calon pasangan lain saat ini.");
      // For demo, we can loop or show a "no more matches" message
      // setCurrentProfileIndex(0); // uncomment to loop back
      setCurrentProfileIndex(-1); // Indicate no profiles left
    }
  };

  // Function to navigate to chat page
  const handleGoToChatPage = () => {
    alert("Mengarah ke Halaman Chat Anda! (Ini adalah daftar chat dengan match Anda)"); // Placeholder for Next.js router.push('/chat')
    console.log("Navigasi ke Halaman Chat.");
  };

  return (
    // Main container uses h-screen w-screen for full screen,
    // flex for centering content, and overflow-hidden to prevent scrolling.
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
    // Header component containing the logo and app title
    // mb-auto to push content down, or mb-0 to stick to top if needed
    <header className="flex flex-col items-center mb-auto pt-4"> {/* Added pt-4 to push header down slightly */}
      {/* Chain Match Logo */}
      <Image
        src={ChainMatchLogo} // Using the defined logo path
        alt="Chain Match Logo"
        width={100} // Further reduced logo size for compactness
        height={100}
        className="size-[80px] md:size-[100px] mb-1 drop-shadow-2xl" // Reduced mb
        style={{
          filter: "drop-shadow(0px 0px 20px #ff00ff)", // More intense neon pink shadow
          background: 'radial-gradient(circle at center, rgba(255,0,255,0.4) 0%, transparent 70%)', // Neon pink glow
          borderRadius: '50%', // Make it circular if the logo is square
        }}
      />

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-white text-center drop-shadow-lg" // Reduced text size
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

// Component: MatchCard
function MatchCard({ match }: { match: Match }) {
  return (
    // Adjusted size for a single, prominent card
    <div className="relative w-64 h-80 md:w-80 md:h-96 bg-gray-900 bg-opacity-70 rounded-xl shadow-2xl border border-pink-500 overflow-hidden neon-card-glow transform hover:scale-105 transition-all duration-200">
      <Image
        src={match.imageUrl}
        alt={match.name}
        layout="fill"
        objectFit="cover"
        className="rounded-t-xl"
        // Fixed: Added type assertion to e.target to access src
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
          const target = e.target as HTMLImageElement;
          target.onerror = null; 
          target.src = "https://placehold.co/400x500/6A0DAD/FFFFFF?text=No+Image"; 
        }} // Fallback image
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent rounded-b-xl">
        <h3 className="text-white text-xl md:text-2xl font-bold" style={{ textShadow: "0 0 8px #00ffff" }}>
          {match.name}, {match.age}
        </h3>
        <p className="text-pink-300 text-sm" style={{ textShadow: "0 0 5px #ff00ff" }}>
          {match.city}
        </p>
      </div>
    </div>
  );
}

// Interface for InteractionButtons props
interface InteractionButtonsProps {
  onLike: () => void; // A function that takes no arguments and returns nothing
  onDislike: () => void; // A function that takes no arguments and returns nothing
}

// Component: InteractionButtons
function InteractionButtons({ onLike, onDislike }: InteractionButtonsProps) {
  return (
    // Adjusted margins to position below the single card
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

// Interface for ChatButton props
interface ChatButtonProps {
  onGoToChat: () => void; // A function that takes no arguments and returns nothing
}

// Component: ChatButton
function ChatButton({ onGoToChat }: ChatButtonProps) {
  return (
    // mb-4 to give some space from the bottom
    <button
      onClick={onGoToChat}
      className="py-2 px-6 md:py-3 md:px-8 text-sm md:text-base font-bold rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 neon-button-shadow mb-4"
    >
      Lihat Chat
    </button>
  );
}

// Keyframe animations for the neon effects
// You'll need to add these to your global CSS file (e.g., globals.css)
// or configure Tailwind CSS to include them.
/*
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 255, 0);
  }
}

.neon-input-shadow {
  box-shadow: 0 0 5px #00ffff;
}
.neon-input-shadow:focus {
  box-shadow: 0 0 10px #ff00ff;
}

.neon-button-shadow {
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.6);
}
.neon-button-shadow:hover {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.8), 0 0 35px rgba(0, 255, 255, 0.8);
}

.neon-button-shadow-red {
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.6), 0 0 25px rgba(255, 100, 100, 0.6);
}
.neon-button-shadow-red:hover {
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 100, 100, 0.8);
}

.neon-button-shadow-green {
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.6), 0 0 25px rgba(100, 255, 100, 0.6);
}
.neon-button-shadow-green:hover {
  box_shadow: 0 0 20px rgba(0, 255, 0, 0.8), 0 0 35px rgba(100, 255, 100, 0.8);
}


.neon-card-glow {
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.5);
}
.neon-card-glow:hover {
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.7), 0 0 25px rgba(0, 255, 255, 0.7);
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-pulse-border {
  animation: pulse-border 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}
*/
