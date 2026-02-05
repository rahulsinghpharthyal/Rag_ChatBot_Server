import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY } from "./env.js";

const pinecone = new PineconeClient({ apiKey: PINECONE_API_KEY });
export const pineconeIndex = pinecone.index("company-chatbot-index");