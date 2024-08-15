import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, useExternal, apiEndpoint, apiKey, model } = req.body;

  const apiUrl = useExternal ? apiEndpoint : process.env.OLLAMA_API_URL;
  const headers = useExternal
    ? {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(model === "microsoft/phi-3-medium-128k-instruct:free" && {
          "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional
          "X-Title": process.env.YOUR_SITE_NAME, // Optional
        }),
      }
    : {};

  try {
    const response = await axios.post(
      `${apiUrl}/chat/completions`,
      {
        model: model,
        messages: [{ role: "user", content: query }],
      },
      { headers }
    );

    // Ensure that only the content is returned
    const botMessage = response.data.choices[0].message.content;
    res.status(200).json({ answer: botMessage });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "API Error:",
        (error as any).response?.data || error.message
      );
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
}
