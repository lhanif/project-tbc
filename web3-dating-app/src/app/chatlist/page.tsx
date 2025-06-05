"use client"; // This directive is necessary for Next.js App Router client components

import React, { useState } from "react"; // Import useState
import Image from "next/image";

// Assuming you have your Chain Match logo image in the public folder.
const ChainMatchLogo = "/chain-match-logo.png"; // Example path to your logo

// Placeholder profile images for chat contacts
const placeholderChatImage1 = "https://placehold.co/100x100/A726A9/FFF?text=User1";
const placeholderChatImage2 = "https://placehold.co/100x100/FF00FF/00FFFF?text=User2";
const placeholderChatImage3 = "https://placehold.co/100x100/00FFFF/FF00FF?text=User3";
const placeholderChatImage4 = "https://placehold.co/100x100/8A2BE2/FFF?text=User4";
const placeholderChatImage5 = "https://placehold.co/100x100/32CD32/FFF?text=User5";


// Interface for a chat contact
interface ChatContact {
  id: number;
  name: string;
  imageUrl: string;
  lastMessage?: string; // Optional: for displaying a snippet
  lastMessageTime?: string; // Optional: for displaying time
}

export default function ChatListPage() { // Renamed from Home to ChatListPage
  // Sample chat contacts
  const [chatContacts, setChatContacts] = useState<ChatContact[]>([
    { id: 1, name: "NeonNessa", imageUrl: "", lastMessage: "Hey, apa kabar?", lastMessageTime: "10:30 AM" },
    { id: 2, name: "SynthSam", imageUrl:"", lastMessage: "Sudah siap nge-match?", lastMessageTime: "Yesterday" },
    { id: 3, name: "PixelPriya", imageUrl: "", lastMessage: "Sampai jumpa nanti!", lastMessageTime: "2 days ago" },
    { id: 4, name: "VoltVic", imageUrl: "", lastMessage: "Ok, see you!", lastMessageTime: "Wed" },
    { id: 5, name: "GlowGreg", imageUrl: "", lastMessage: "Great to connect!", lastMessageTime: "Mar 15" },
  ]);

  // Function to simulate navigating to a specific chat (e.g., /chat/[id])
  const handleOpenChat = (contactId: number, contactName: string) => {
    alert(`Membuka chat dengan ${contactName} (ID: ${contactId})`); // Placeholder for actual navigation
    console.log(`Navigating to chat with ${contactName}`);
    // In a real app, you'd use router.push(`/chat/${contactId}`);
  };

  // Function to simulate going back to the home/swipe page
  const handleGoBack = () => {
    alert("Kembali ke Halaman Utama/Swipe!"); // Placeholder for actual navigation
    console.log("Going back to main page.");
    // In a real app, you'd use router.push('/'); or router.back();
  };

  return (
    // Main container now uses h-screen w-screen for full screen,
    // flex items-center justify-center for perfect centering,
    // and overflow-hidden to prevent scrolling.
    // Background gradient and neon blobs for visual effect.
    <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background circles/blobs for neon effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content wrapper - centered by parent `main` */}
      {/* Adjusted padding for chat list layout */}
      <div className="relative z-10 p-4 flex flex-col items-center w-full max-w-md md:max-w-lg h-full"> {/* Adjusted max-w for chat list */}
        {/* Header section with logo and title */}
        <Header />

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="self-start py-1 px-3 mb-4 text-xs font-bold rounded-full bg-gray-700 bg-opacity-70 text-white shadow-lg hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 neon-button-shadow"
        >
          ← Kembali
        </button>

        {/* Chat List Container */}
        <div className="w-full flex-grow bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-500 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold text-white p-4 border-b border-blue-700" style={{ textShadow: "0 0 8px #00ffff" }}>
            Daftar Chat Anda
          </h2>
          {chatContacts.length > 0 ? (
            <div className="divide-y divide-purple-800">
              {chatContacts.map(contact => (
                <ChatListItem 
                  key={contact.id} 
                  contact={contact} 
                  onOpenChat={handleOpenChat} 
                />
              ))}
            </div>
          ) : (
            <p className="text-pink-300 text-center p-4">
              Anda belum memiliki chat. Temukan pasangan baru!
            </p>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles (from previous iteration, still relevant if list grows) */}
      <style jsx global>{`
        /* Webkit (Chrome, Safari, Edge) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 0, 255, 0.6); /* Neon pink */
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 255, 255, 0.8); /* Neon blue on hover */
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 0, 255, 0.6) rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </main>
  );
}

function Header() {
  return (
    // Header component containing the logo and app title
    <header className="flex flex-col items-center mb-6"> {/* Adjusted mb */}
      {/* Chain Match Logo */}
      <Image
        src={ChainMatchLogo} // Using the defined logo path
        alt="Chain Match Logo"
        width={90} // Compact logo size
        height={90}
        className="size-[70px] md:size-[90px] mb-1 drop-shadow-2xl" // Reduced mb
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

      <p className="text-xs text-pink-300 text-center max-w-xs font-medium" // Reduced text size and max-w
         style={{ textShadow: "0 0 4px #ff00ff" }}> {/* Subtle neon text shadow */}
        Daftar Pesan Anda
      </p>
    </header>
  );
}

// New Component: ChatListItem
interface ChatListItemProps {
  contact: ChatContact;
  onOpenChat: (id: number, name: string) => void;
}

function ChatListItem({ contact, onOpenChat }: ChatListItemProps) {
  return (
    <div
      onClick={() => onOpenChat(contact.id, contact.name)}
      className="flex items-center p-3 md:p-4 cursor-pointer hover:bg-gray-800 transition-colors duration-200 border-b border-pink-700 last:border-b-0"
    >
      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-blue-500 flex-shrink-0">
        <Image
          src={contact.imageUrl}
          alt={contact.name}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = "https://placehold.co/100x100/6A0DAD/FFFFFF?text=PFP"; 
          }} // Fallback image
        />
      </div>
      <div className="ml-3 flex-grow overflow-hidden">
        <h3 className="text-white text-base md:text-lg font-semibold truncate" style={{ textShadow: "0 0 5px #00ffff" }}>
          {contact.name}
        </h3>
        {contact.lastMessage && (
          <p className="text-pink-300 text-sm truncate" style={{ textShadow: "0 0 3px #ff00ff" }}>
            {contact.lastMessage}
          </p>
        )}
      </div>
      {contact.lastMessageTime && (
        <p className="text-gray-400 text-xs ml-auto flex-shrink-0" style={{ textShadow: "0 0 2px #aaa" }}>
          {contact.lastMessageTime}
        </p>
      )}
    </div>
  );
}


// Keyframe animations for the neon effects (kept for reference, assume in global CSS)
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
