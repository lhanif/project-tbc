'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ChatBubble from '@/components/ChatBubble'; // Ensure this path is correct

interface ChatMsg {
  from: string;
  text: string;
  createdAt?: string; // Assuming createdAt might be part of the message object
}

export default function ChatPage() {
  const router = useRouter();
  const pathname = usePathname();
  // Extracts the last segment of the URL, e.g., 'some-wallet-id' from '/chat/some-wallet-id'
  const peerWallet = pathname.split('/').pop() || '';

  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // This should ideally come from a user context or authentication
  const myWallet = '1'; // Placeholder for the actual user's wallet ID

  // Log the peer wallet for debugging purposes
  console.log('Chatting with:', peerWallet);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // Fetch messages from the backend when the component mounts or peerWallet changes
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat/${peerWallet}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch messages: ${res.statusText}`);
        }
        const data: ChatMsg[] = await res.json();
        setMsgs(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Optionally, display an error message to the user
      }
    }

    if (peerWallet) {
      fetchMessages();
    }
  }, [peerWallet]);

  // Handle sending a new message
  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const newMsg = {
      from: myWallet,
      to: peerWallet,
      text: input.trim(),
      // createdAt: new Date().toISOString(), // You might want to add a client-side timestamp
    };

    try {
      const res = await fetch(`/api/chat/${peerWallet}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      });

      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.statusText}`);
      }

      const savedMsg = await res.json(); // The backend might return the saved message with a `_id` and `createdAt`

      // Add the newly sent message to the state
      setMsgs((prev) => [...prev, savedMsg]);
      setInput(''); // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <main
      className="flex flex-col h-screen p-4
                 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950
                 text-white font-sans overflow-hidden" // Main page background and text style
    >
      {/* Header with Back Button and Peer Name */}
      <div className="flex items-center justify-between mb-4 p-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-white text-lg hover:text-purple-300 transition-colors"
        >
          <span className="text-2xl mr-2">←</span> Kembali
        </button>
        <h1 className="text-2xl font-bold text-center flex-grow">
          Chat dengan {peerWallet}
        </h1>
        {/* Potentially add peer's avatar or status here */}
      </div>

      {/* Main chat messages container */}
      <div
        className="flex-1 flex flex-col p-4 mb-4 rounded-xl shadow-lg
                   bg-gray-900 bg-opacity-70 border border-gray-700
                   overflow-y-auto custom-scrollbar" // Custom scrollbar for better appearance
      >
        <div className="flex-1 space-y-3 pb-2"> {/* Padding bottom for scroll consistency */}
          {msgs.map((m, i) => (
            // ChatBubble component should be styled to reflect own vs. peer messages
            <ChatBubble key={i} message={m.text} isOwnMessage={m.from === myWallet} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input and send button */}
      <div className="flex gap-3 p-3 bg-gray-900 bg-opacity-70 rounded-xl shadow-lg border border-gray-700">
        <input
          type="text"
          className="flex-1 px-5 py-3 rounded-full
                     bg-gray-800 text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent
                     transition-all duration-200"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-6 py-3 rounded-full
                     bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold
                     hover:from-purple-700 hover:to-pink-700
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-all duration-200"
        >
          Kirim
        </button>
      </div>
    </main>
  );
}