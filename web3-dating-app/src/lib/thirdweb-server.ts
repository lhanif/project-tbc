import { ethers, JsonRpcProvider, Wallet, Contract } from "ethers";
import * as dotenv from "dotenv";


dotenv.config();
const contractABI = [
  "function verifyUser(address user) external",
];
const privateKey = process.env.ADMIN_PRIVATE_KEY as string;
const rpcUrl = process.env.RPC_URL as string;
const contractAddress = process.env.CONTRACT_ADDRESS as string;

const provider = new JsonRpcProvider(rpcUrl);
const wallet = new Wallet(privateKey, provider);

const contract = new Contract(contractAddress, contractABI, wallet);

async function verifyUser(userAddress: string) {
  const tx = await contract.verifyUser(userAddress);
  console.log("Tx hash:", tx.hash);
  await tx.wait();
  console.log("Verification complete.");
}

verifyUser("0xUserWalletAddress").catch(console.error);
