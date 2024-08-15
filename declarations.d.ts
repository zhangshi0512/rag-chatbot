declare module "transformers" {
  export const AutoTokenizer: any;
  export const AutoModel: any;
}

declare module "pdf-parse" {
  const content: (buffer: Buffer) => Promise<{ text: string }>;
  export default content;
}

declare module "mammoth" {
  export const extractRawText: (options: {
    path: string;
  }) => Promise<{ value: string }>;
}

declare module "markdown-it" {
  const MarkdownIt: any;
  export default MarkdownIt;
}
