// ../../utils/embedding.ts

import { TokenizerService } from "./tokenizer";

const tokenizer = new TokenizerService();

export async function getEmbedding(text: string): Promise<number[]> {
  const tokens = tokenizer.tokenize(text);
  const uniqueTokens = [...new Set(tokens)];
  const embedding = new Array(uniqueTokens.length).fill(0);

  tokens.forEach((token) => {
    const index = uniqueTokens.indexOf(token);
    if (index !== -1) {
      embedding[index]++;
    }
  });

  // Normalize the embedding
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
  return embedding.map((val) => val / magnitude);
}
