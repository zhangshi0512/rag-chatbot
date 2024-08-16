// ../components/DocumentUploader.tsx

import React from "react";
import { Box, Button } from "@mui/material";

const DocumentUploader: React.FC = () => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file: File) => formData.append("files", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data); // Handle the uploaded documents
    }
  };

  return (
    <Box>
      <input type="file" multiple onChange={handleFileUpload} />
    </Box>
  );
};

export default DocumentUploader;
