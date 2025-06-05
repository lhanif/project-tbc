import { NextResponse } from "next/server";
import { connectToDatabase } from '@/lib/mongodb';
import Like from "@/models/Like";     // model Like
import Match from "@/models/Match"   // model Match

export async function POST(req: Request) {
  await connectToDatabase();
  console.log("Connected to MongoDB");

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Gagal parsing JSON dari request:", error);
    return NextResponse.json({ error: "Format JSON tidak valid." }, { status: 400 });
  }

  const { userIdSaya, userIdPasangan } = body;
  if (!userIdSaya || !userIdPasangan) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }

  try {
    console.log("Like dari:", userIdSaya, "ke:", userIdPasangan);

    const existingLike = await Like.findOne({ from: userIdSaya, to: userIdPasangan });
    if (existingLike) {
      return NextResponse.json({ message: "Sudah di-like sebelumnya." });
    }

    await Like.create({ from: userIdSaya, to: userIdPasangan });

    const mutualLike = await Like.findOne({ from: userIdPasangan, to: userIdSaya });
    if (mutualLike) {
      const existingMatch = await Match.findOne({
        $or: [
          { userA: userIdSaya, userB: userIdPasangan },
          { userA: userIdPasangan, userB: userIdSaya },
        ],
      });

      if (!existingMatch) {
        await Match.create({ userA: userIdSaya, userB: userIdPasangan });
      }

      return NextResponse.json({ message: "Match!" });
    } else {
      return NextResponse.json({ message: "Like tersimpan, belum match." });
    }
  } catch (error) {
    console.error("Error server saat simpan like:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}



