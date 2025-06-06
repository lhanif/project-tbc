import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/models/User'; // sesuaikan path import model User-mu

// Fungsi koneksi MongoDB (sesuaikan dengan implementasimu)
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI || '');
}

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
