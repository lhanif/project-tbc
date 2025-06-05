import { ethers, JsonRpcProvider } from "ethers";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const contractAbi = [
  "function verifyUser(address user) external",
];

const userSchema = new mongoose.Schema({
  wallet: String,
  isVerified: Boolean,
  pushedToChain: Boolean, 
});
const User = mongoose.model("User", userSchema);

async function main() {
  // connect to DB
  await mongoose.connect(process.env.MONGODB_URI!);

  // connect to Ethereum
  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ORACLE!, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, contractAbi, signer);

  console.log("Mencari user yang belum disinkronkan...");
  const users = await User.find({ isVerified: true, pushedToChain: { $ne: true } });

  for (const user of users) {
    try {
      console.log(`Verifying ${user.wallet} on-chain...`);
      const tx = await contract.verifyUser(user.wallet);
      await tx.wait();

      user.pushedToChain = true;
      await user.save();

      console.log(`Success for ${user.wallet}`);
    } catch (err) {
      console.error(`Gagal verifikasi ${user.wallet}:`, err);
    }
  }

  console.log("Selesai");
  process.exit();
}

main().catch(console.error);
