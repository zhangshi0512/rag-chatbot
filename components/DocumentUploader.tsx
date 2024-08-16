// ../../components/DocumentUploader.tsx

import React, { useState } from "react";
import { Box, Button } from "@mui/material";

interface DocumentUploaderProps {
  onDocumentsProcessed: (documents: string[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentsProcessed,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);
      const formData = new FormData();
      Array.from(files).forEach((file: File) => formData.append("files", file));

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.documents) {
          onDocumentsProcessed(data.documents);
        }
      } catch (error) {
        console.error("Error uploading documents:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        disabled={isUploading}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button component="span" variant="contained" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Choose Files"}
        </Button>
      </label>
    </Box>
  );
};

export default DocumentUploader;
