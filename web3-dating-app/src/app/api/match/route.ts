import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Match from "@/models/Match";
import {User} from "@/models/User"; 

// http://localhost:3000/api/match?userIdSaya=123abc
export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const userIdSaya = searchParams.get("userIdSaya");

  if (!userIdSaya) {
    return NextResponse.json({ error: "Parameter userIdSaya wajib diisi." }, { status: 400 });
  }

  try {
    // Cari semua match di mana userIdSaya ada di userA atau userB
    const matches = await Match.find({
      $or: [
        { userA: userIdSaya },
        { userB: userIdSaya },
      ],
    });

    // Ambil pasangan (lawan dari userIdSaya)
    const pasanganWallets = matches.map((match: any) =>
      match.userA === userIdSaya ? match.userB : match.userA
    );

    // Ambil data fullName dari user berdasarkan wallet pasangan
    const pasanganUsers = await User.find({ wallet: { $in: pasanganWallets } });

    // Format hasil
    const pasanganList = pasanganUsers.map((user: any) => ({
      wallet: user.wallet,
      fullName: user.fullName,
    }));

    return NextResponse.json({ pasangan: pasanganList });
  } catch (error) {
    console.error("Gagal mengambil match:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
