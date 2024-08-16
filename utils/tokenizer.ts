// ../../utils/tokenizer.ts

export class TokenizerService {
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((token) => token.length > 0);
  }
}
