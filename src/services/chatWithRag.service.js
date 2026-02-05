import { pineconeIndex } from "../config/vectorDB.js";
import groq from "../ai/groqClient.js";
import { getEmbedder } from "../ai/embedder.js";
// import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

// const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });
// const pineconeIndex = pinecone.index("company-chatbot-index"); // must be 384-dim index

// Load Hugging Face embedder (same model you used for docs)
// const embedder = await pipeline(
//   "feature-extraction",
//   "Xenova/all-MiniLM-L6-v2",
// );

export const chatWithRagService = async (question) => {
  // retrival steps:-
  // 🔹 Generate embeddings using Hugging Face
  const embedder = await getEmbedder();
  const output = await embedder(question, {
    pooling: "mean",
    normalize: true,
  });
  const queryEmbedding = Array.from(output.data); // 384-dim array
  console.log(queryEmbedding);
  // 🔹 Query Pinecone
  const results = await pineconeIndex.namespace("document").query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true,
  });

  // console.log(
  //   "🔎 Retrieval results:",
  //   results.matches.map((m) => m.metadata.text),
  // );

  const context = results.matches.map((m) => m.metadata.text).join("\n\n");
  // console.log("this is context", context);
  /**
   *
   */

  const SYSTEM_PROMPT = `
You are a precise and reliable assistant.

You MUST answer the user's question using ONLY the information provided in the CONTEXT section.
Do NOT use prior knowledge or make assumptions.

If the answer cannot be found in the CONTEXT, respond exactly with:
"I could not find a definitive answer in the provided information."
`;

  const userQuery = `Question: ${question} Relevent context: ${context} Answer: `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  // console.log("Assistent:", completion?.choices[0]?.message?.content);
  return completion?.choices[0]?.message?.content;
};
