// ../../pages/api/upload.ts

import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { extractText } from "@utils/fileProcessor";

const upload = multer({ dest: "/tmp" });

export const config = {
  api: {
    bodyParser: false,
  },
};

interface NextApiRequestWithFiles extends NextApiRequest {
  files: Express.Multer.File[];
}

export default function handler(
  req: NextApiRequestWithFiles,
  res: NextApiResponse
) {
  upload.array("files")(req as any, {} as any, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const files = req.files;
    if (!files) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const documents = await extractText(files);
    res.status(200).json({ documents });
  });
}
