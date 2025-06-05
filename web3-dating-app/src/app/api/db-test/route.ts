import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'success', message: 'MongoDB connected ✅' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'MongoDB connection failed ❌', error });
  }
}
