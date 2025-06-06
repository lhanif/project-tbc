import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Cek apakah model sudah ada untuk mencegah error compile ulang di dev mode
const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);

export default ChatMessage;
