import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { pineconeIndex } from "../config/vectorDB.js";
import { getEmbedder } from "../ai/embedder.js";
// import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

//  Load Hugging Face embedding model
// const embedder = await pipeline(
//   "feature-extraction",
//   "Xenova/all-MiniLM-L6-v2",
// );

// const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });
// const pineconeIndex = pinecone.Index("company-chatbot-index");
// const vectorStore = new PineconeStore(embeddings, {
//   pineconeIndex,
//   maxConcurrency: 5,
// });

// langachain is a big framewrok use many cases when we build the chat bot
export const indexTheDocument = async (filePath) => {
  // 1. Load PDF
  const loader = new PDFLoader(filePath, { splitPages: false }); // splitPages gives the single document for all pdf pages
  const document = await loader.load();
  // console.log("this is docs after loading", document[0].pageContent);

  // 2. Split into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // 500, //100
    chunkOverlap: 150, //100, //0
  });

  const texts = await textSplitter.splitText(document[0].pageContent);

  // console.log("this is texts-->", texts.length);

  // 3. Convert Chunks into vectors
  const embedder = await getEmbedder();
  const vectors = [];
  for (let i = 0; i < texts.length; i++) {
    const output = await embedder(texts[i], {
      pooling: "mean",
      normalize: true,
    });
    vectors.push({
      id: `chunk-${i}`, // unique id for Pinecone
      values: Array.from(output.data), // embedding vector
      metadata: { text: texts[i] }, // store original text
    });
  }

  // console.log("Generated", vectors.length, "embeddings");
  if (!vectors.length) {
    throw new Error("No vectors generated, aborting Pinecone upsert");
  }

  console.log("Is real index:", typeof pineconeIndex.upsert);
  // 6. Upload to Pinecone
  await pineconeIndex.namespace("document")
  .upsert(vectors);
  console.log("Stored in Pinecone!");
};
