// client.ts (tidak langsung dieksekusi)
import { createThirdwebClient, readContract, getContract,  } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});

export const contract = getContract({
  client,
  chain: sepolia,
  address: "0x81B2d97830fA0E720C02052cD2AEd5AFE39FdAfC"
});

// Fungsi async yang bisa kamu panggil di React
export async function checkIfUserIsVerified(userAddress: string) {
  return await readContract({
    contract,
    method: "function isUserVerified(address) view returns (bool)",
    params: [userAddress],
  });
}