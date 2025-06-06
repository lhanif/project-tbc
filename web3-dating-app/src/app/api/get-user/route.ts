import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';     // sesuaikan path file modelnya

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ wallet });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

