// ../../utils/fileProcessor.ts

import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import MarkdownIt from "markdown-it";

export async function extractText(
  files: Array<Express.Multer.File>
): Promise<string[]> {
  const documents = [];
  for (let file of files) {
    const extension = path.extname(file.originalname);
    let content = "";
    try {
      switch (extension) {
        case ".txt":
          content = fs.readFileSync(file.path, "utf8");
          break;
        case ".pdf":
          content = (await pdfParse(fs.readFileSync(file.path))).text;
          break;
        case ".docx":
          content = (await mammoth.extractRawText({ path: file.path })).value;
          break;
        case ".md":
          content = new MarkdownIt().render(fs.readFileSync(file.path, "utf8"));
          break;
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }
      documents.push(content);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        throw new Error(
          `Error processing file ${file.originalname}: ${error.message}`
        );
      } else {
        console.error(
          `Unexpected error processing file ${file.originalname}:`,
          error
        );
        throw new Error(
          `Unexpected error processing file ${file.originalname}`
        );
      }
    }
  }
  return documents;
}
