// ../../pages/api/chat.ts

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getEmbedding } from "../../utils/embedding";

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function findRelevantContext(
  query: string,
  documents: string[]
): Promise<string> {
  const queryEmbedding = await getEmbedding(query); // Await the embedding
  const documentEmbeddings = await Promise.all(
    documents.map((doc) => getEmbedding(doc))
  ); // Await all document embeddings
  const similarities = documentEmbeddings.map((docEmb) =>
    cosineSimilarity(queryEmbedding, docEmb)
  );
  const maxSimilarityIndex = similarities.indexOf(Math.max(...similarities));
  return documents[maxSimilarityIndex];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, useExternal, apiEndpoint, apiKey, model, documents } =
    req.body;

  const apiUrl = useExternal
    ? apiEndpoint
    : (process.env.OLLAMA_API_URL || "").replace(/\/$/, "");

  const localModel = "llama3.1:latest";

  const headers = useExternal
    ? {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };

  try {
    const relevantContext = await findRelevantContext(query, documents); // Await the context finding
    const promptWithContext = `Context: ${relevantContext}\n\nQuestion: ${query}\n\nAnswer:`;

    const response = await axios.post(
      `${apiUrl}/api/generate`,
      {
        model: useExternal ? model : localModel,
        prompt: promptWithContext,
        stream: false,
      },
      { headers }
    );

    console.log("API Response:", response.data);

    const botMessage = response.data.response;
    res.status(200).json({ answer: botMessage });
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      res.status(500).json({
        error: `An error occurred while processing your request: ${error.message}`,
      });
    } else {
      res.status(500).json({
        error: "An unknown error occurred while processing your request.",
      });
    }
  }
}
