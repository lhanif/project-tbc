// components/ChatBubble.tsx
import React from 'react';

interface ChatBubbleProps {
  message: string;
  isOwnMessage: boolean;
}

export default function ChatBubble({ message, isOwnMessage }: ChatBubbleProps) {
  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg text-white break-words
          ${isOwnMessage
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 rounded-br-none' // Your messages: purple/pink gradient
            : 'bg-gray-700 rounded-bl-none' // Peer messages: dark gray
          }
        `}
      >
        {message}
      </div>
    </div>
  );
}