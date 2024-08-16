// ../../pages/api/chat.ts

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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
    let payload;

    if (useExternal) {
      // For external API, integrate documents into the conversation context
      const context = documents.map((doc: string, index: number) => ({
        role: "system",
        content: `Document ${index + 1}: ${doc}`,
      }));

      payload = {
        model,
        messages: [...context, { role: "user", content: query }],
      };
    } else {
      // Local API usage
      payload = {
        model: localModel,
        messages: [{ role: "user", content: query }],
        stream: false,
      };
    }

    const response = await axios.post(`${apiUrl}/chat/completions`, payload, {
      headers,
    });

    const botMessage =
      response.data.choices?.[0]?.message?.content || "No response from API";
    res.status(200).json({ answer: botMessage });
  } catch (error) {
    console.error("API Error:", error);
    if (error instanceof Error) {
      res.status(500).json({
        error: `An error occurred while processing your request: ${error.message}`,
      });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
}
