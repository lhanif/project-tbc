// src/app/api/chat/[wallet]/route.ts
import { NextResponse } from 'next/server';
// Ensure these paths are correct for your project structure
import { connectToDatabase } from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage'; // Assuming ChatMessage is your Mongoose model

export async function GET(
  request: Request, // The incoming request object
  { params }: { params: { wallet: string } } // Dynamic route parameters, e.g., the wallet ID
) {
  await connectToDatabase();
  const { wallet: peerWallet } = await params; // The wallet from the URL path

  const myWallet = '1'; 

  try {
    const messages = await ChatMessage.find({
      $or: [
        { from: myWallet, to: peerWallet }, // Messages sent by me to peer
        { from: peerWallet, to: myWallet }, // Messages sent by peer to me
      ],
    }).sort({ createdAt: 1 }); // Sort by creation date in ascending order

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { message: 'Failed to fetch messages', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request, // The incoming request object
  { params }: { params: { wallet: string } } // Dynamic route parameters
) {
  await connectToDatabase();
  const { wallet: peerWallet } = await params; // The wallet from the URL path

  try {
    const body = await request.json(); // Parse the JSON body of the request
    const { from, to, text } = body;

    if (!from || !to || !text) {
      return NextResponse.json({ message: 'Missing required fields (from, to, text)' }, { status: 400 });
    }

    if (to !== peerWallet) {
        return NextResponse.json({ message: 'URL wallet does not match message recipient', peerWalletFromUrl: peerWallet, recipientInBody: to }, { status: 400 });
    }

    const newMessage = new ChatMessage({ from, to, text });
    await newMessage.save();

    return NextResponse.json(newMessage, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Error sending chat message:', error);
    return NextResponse.json(
      { message: 'Failed to send message', error: (error as Error).message },
      { status: 500 }
    );
  }
}

