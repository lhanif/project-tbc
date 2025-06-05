"use client"; // This directive is necessary for Next.js App Router client components

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createLightNode, waitForRemotePeer, LightNode, Protocols } from "@waku/sdk";
import { bytesToUtf8, utf8ToBytes } from "@waku/sdk";

// Assuming you have your Chain Match logo image in the public folder.
const ChainMatchLogo = "/chain-match-logo.png"; // Example path to your logo

// Define a simple message interface for clarity
interface ChatMessage {
  sender: string;
  text: string;
  timestamp: Date;
  isSelf: boolean; // To differentiate sender for styling
}

// Define the content topic for our public chat room
const CONTENT_TOPIC = "/chainmatch/1/general-chat/proto";

export default function WakuChatApp() {
  const [wakuNode, setWakuNode] = useState<LightNode | null>(null);
  const [wakuStatus, setWakuStatus] = useState("Menghubungkan ke Waku...");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("Anonim"); // Simple username for demo
  const chatMessagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to bottom

  // Effect to initialize Waku node on component mount
  useEffect(() => {
    const initWaku = async () => {
      try {
        setWakuStatus("Memulai node Waku...");
        // Create a Waku light node
        const node = await createLightNode({ defaultBootstrap: true });
        await node.start();
        setWakuNode(node);
        setWakuStatus("Menunggu peer Waku...");

        // Wait for a remote peer to be connected for Waku communication
        await waitForRemotePeer(node, [Protocols.LightPush, Protocols.Filter, Protocols.Store]);
        setWakuStatus("Terhubung ke jaringan Waku!");

        // Subscribe to messages on the defined content topic
        const unsubscribe = await node.filter.subscribe([
          { contentTopic: CONTENT_TOPIC }
        ], (wakuMessage) => {
          if (!wakuMessage.payload) return;

          try {
            const receivedText = bytesToUtf8(wakuMessage.payload);
            const parsedMessage = JSON.parse(receivedText); // Assuming messages are JSON
            
            // Add received message to state
            setMessages(prevMessages => [...prevMessages, {
              sender: parsedMessage.sender,
              text: parsedMessage.text,
              timestamp: new Date(parsedMessage.timestamp),
              isSelf: parsedMessage.sender === username // Check if sender is current user
            }]);
          } catch (error) {
            console.error("Gagal parse pesan Waku:", error);
          }
        });

        // Return cleanup function for unsubscribe
        return () => {
          unsubscribe();
          node.stop();
        };

      } catch (error) {
        console.error("Gagal inisialisasi Waku:", error);
        setWakuStatus(`Gagal: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    initWaku();
  }, []); // Run only once on mount

  // Effect to scroll to the bottom of the chat messages
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Scroll whenever messages update

  // Function to send a message
  const sendMessage = async () => {
    if (!wakuNode || !messageInput.trim()) {
      console.warn("Waku node belum siap atau pesan kosong.");
      return;
    }

    try {
      const messagePayload = {
        sender: username,
        text: messageInput.trim(),
        timestamp: new Date().toISOString(), // Use ISO string for consistent parsing
      };
      
      // Send the message using Waku's light push protocol
      const { push } = await wakuNode.lightPush.push(utf8ToBytes(JSON.stringify(messagePayload)), {
        contentTopic: CONTENT_TOPIC,
      });

      // Optimistically add the message to the UI
      setMessages(prevMessages => [...prevMessages, {
        sender: username,
        text: messageInput.trim(),
        timestamp: new Date(),
        isSelf: true
      }]);

      setMessageInput(""); // Clear input field

      console.log("Pesan dikirim:", messagePayload);

    } catch (error) {
      console.error("Gagal mengirim pesan Waku:", error);
      alert("Gagal mengirim pesan. Coba lagi."); // Using alert for demo
    }
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for new line
      e.preventDefault(); // Prevent new line
      sendMessage();
    }
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

      {/* Content wrapper for the chat interface */}
      <div className="relative z-10 flex flex-col w-full max-w-xl md:max-w-2xl h-[90vh] bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-500 neon-card-glow">
        {/* Header */}
        <Header />

        {/* Waku Status */}
        <div className="text-center text-xs text-purple-300 py-1 border-b border-purple-800" style={{ textShadow: "0 0 3px #ff00ff" }}>
          Status Waku: {wakuStatus}
        </div>

        {/* Username Input */}
        <div className="p-3 border-b border-purple-800 flex items-center gap-2">
          <label htmlFor="username" className="text-pink-300 text-sm">Nama Pengguna:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-grow p-1 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-inner"
            placeholder="Set nama pengguna Anda"
            maxLength={15} // Limit username length
          />
        </div>

        {/* Chat Messages Area */}
        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center text-sm">
              Belum ada pesan. Mulai kirim chat!
            </p>
          )}
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          <div ref={chatMessagesEndRef} /> {/* Scroll target */}
        </div>

        {/* Message Input and Send Button */}
        <div className="p-4 border-t border-blue-700 flex items-end gap-2 bg-gray-900 bg-opacity-80">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-pink-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-inner resize-none min-h-[40px] max-h-[120px]"
            placeholder="Ketik pesan Anda..."
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!wakuNode || isGeneratingBio} // Disable if Waku not ready or generating bio (if applicable)
            className="py-2 px-4 text-sm font-bold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 neon-button-shadow flex-shrink-0"
          >
            Kirim
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
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

        /* Animations (copied from previous iterations) */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        .neon-card-glow {
          box-shadow: 0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </main>
  );
}

function Header() {
  return (
    // Header component containing the logo and app title
    <header className="flex flex-col items-center py-4 border-b border-blue-700"> {/* Adjusted padding and border */}
      {/* Chain Match Logo */}
      <Image
        src={ChainMatchLogo} // Using the defined logo path
        alt="Chain Match Logo"
        width={70} // Smaller logo for chat page
        height={70}
        className="size-[60px] md:size-[70px] mb-1 drop-shadow-2xl"
        style={{
          filter: "drop-shadow(0px 0px 20px #ff00ff)",
          background: 'radial-gradient(circle at center, rgba(255,0,255,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white text-center drop-shadow-lg"
          style={{ textShadow: "0 0 8px #ff00ff, 0 0 15px #00ffff" }}>
        Chain <span className="text-blue-400">Chat</span>
      </h1>

      <p className="text-xs text-pink-300 text-center max-w-xs font-medium"
         style={{ textShadow: "0 0 4px #ff00ff" }}>
        Obrolan Terdesentralisasi
      </p>
    </header>
  );
}

// New Component: MessageBubble
function MessageBubble({ message }: { message: ChatMessage }) {
  const isSelf = message.isSelf;
  const bubbleClasses = isSelf
    ? "bg-purple-700 ml-auto rounded-br-none" // Purple for self, no bottom-right radius
    : "bg-blue-700 mr-auto rounded-bl-none"; // Blue for others, no bottom-left radius

  const textShadowStyle = isSelf 
    ? { textShadow: "0 0 5px #ff00ff" } // Pink glow for own messages
    : { textShadow: "0 0 5px #00ffff" }; // Blue glow for others' messages

  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 max-w-[70%] rounded-xl text-white shadow-md ${bubbleClasses}`} style={{ boxShadow: isSelf ? "0 0 8px rgba(255,0,255,0.7)" : "0 0 8px rgba(0,255,255,0.7)" }}>
        <p className="font-bold text-sm mb-1" style={textShadowStyle}>{message.sender}</p>
        <p className="text-sm break-words" style={textShadowStyle}>{message.text}</p>
        <p className="text-right text-xs text-gray-300 mt-1" style={{ textShadow: "none" }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
