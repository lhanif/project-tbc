import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { uploadToIPFS } from '@/lib/pinata';
import { User } from '@/models/User';
import { ethers, JsonRpcProvider, Wallet, Contract } from 'ethers';

import * as dotenv from 'dotenv';

dotenv.config();
const contractABI = [
  "function verifyUser(address user) external",
];
const privateKey = process.env.ADMIN_PRIVATE_KEY as string;
const rpcUrl = process.env.RPC_URL 
const contractAddress = process.env.CONTRACT_ADDRESS as string;
const provider = new JsonRpcProvider(rpcUrl);
const signer = new Wallet(privateKey, provider);
const contract = new Contract(contractAddress, contractABI, signer);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const wallet = formData.get('wallet')?.toString();
    const fullName = formData.get('fullName')?.toString();
    const dob = formData.get('dob')?.toString();
    const gender = formData.get('gender')?.toString();
    const city = formData.get('city')?.toString();
    const bio = formData.get('bio')?.toString();
    const hobbiesStr = formData.get('hobbies')?.toString();
    const hobbies = hobbiesStr?.split(',').map(h => h.trim()) || [];

    const ktpFile = formData.get('ktp') as File | null;
    const profilePictureFile = formData.get('profilePicture') as File | null;

    if (!wallet || !ktpFile || !profilePictureFile) {
      return NextResponse.json({ error: 'Wallet, KTP, and Profile Picture are required' }, { status: 400 });
    }

    const ktpBuffer = Buffer.from(await ktpFile.arrayBuffer());
    const ktpCid = await uploadToIPFS(ktpBuffer, 'ktp-verification');

    const profileBuffer = Buffer.from(await profilePictureFile.arrayBuffer());
    const profileCid = await uploadToIPFS(profileBuffer, 'profile-picture');

    // 🔐 Panggil fungsi smart contract langsung pakai ethers.js
    const tx = await contract.verifyUser(wallet); // <--- sesuai fungsi di kontrak kamu
    await tx.wait();

    const user = await User.findOneAndUpdate(
      { wallet },
      {
        wallet,
        fullName,
        dob: dob ? new Date(dob) : null,
        gender,
        city,
        hobbies,
        bio,
        profileCid,
        ktpCid,
        isVerified: true,
        verifiedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'User verified & saved', txHash: tx.hash });
  } catch (error) {
    console.error('verify-id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
