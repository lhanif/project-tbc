"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { uploadToIPFS } from "../utils/ipfs";

export default function SignupForm() {
  const { address } = useAccount();
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!image) return alert("Upload foto dulu");

    const imageCID = await uploadToIPFS(image);
    const payload = {
      walletAddress: address,
      bio,
      profileImage: imageCID,
    };

    const res = await fetch("/api/user/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Signup berhasil!");
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 border rounded">
      <label className="block mb-2">Bio:</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 mb-4 border rounded" />
      
      <label className="block mb-2">Foto Profil:</label>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mb-4" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
