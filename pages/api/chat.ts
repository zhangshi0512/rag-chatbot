import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, useExternal, apiEndpoint, apiKey, model } = req.body;

  const apiUrl = useExternal
    ? apiEndpoint
    : (process.env.OLLAMA_API_URL || "").replace(/\/$/, "");

  const localModel = "llama3.1:latest"; // Make sure this matches your local model

  const headers = useExternal
    ? {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };

  try {
    const response = await axios.post(
      `${apiUrl}/api/generate`,
      {
        model: useExternal ? model : localModel,
        prompt: query,
        stream: false, // Set to false to get the complete response at once
      },
      { headers }
    );

    console.log("API Response:", response.data);

    // Extract the full response text
    const botMessage = response.data.response;
    res.status(200).json({ answer: botMessage });
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
}
