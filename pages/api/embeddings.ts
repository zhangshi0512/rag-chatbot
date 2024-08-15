import { NextApiRequest, NextApiResponse } from "next";
import { getEmbedding } from "../../utils/embedding";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;
  const embedding = await getEmbedding(text);
  res.status(200).json({ embedding });
}
