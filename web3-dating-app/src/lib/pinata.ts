import  PinataClient  from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY!,
});

/**
 * Upload file buffer or arrayBuffer to IPFS via Pinata
 * @param input - Can be Buffer (Node.js) or File (Browser)
 * @param name - Metadata name (optional)
 * @returns CID (IpfsHash)
 */
export async function uploadToIPFS(
  input: Buffer | File,
  name: string = 'uploaded-file'
): Promise<string> {
  let buffer: Buffer;

  if (input instanceof File) {
    const arrBuffer = await input.arrayBuffer();
    buffer = Buffer.from(arrBuffer);
  } else {
    buffer = input;
  }

  const stream = Readable.from(buffer);
  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name },
  });

  return result.IpfsHash;
}
