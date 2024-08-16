// ../../pages/index.tsx

import React, { useState } from "react";
import {
  Box,
  Switch,
  FormControlLabel,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Paper,
} from "@mui/material";
import ChatBox from "../components/ChatBox";
import DocumentUploader from "../components/DocumentUploader";
import ChatHistory from "../components/ChatHistory";

interface ChatEntry {
  user: string;
  bot: string;
}

export default function Home() {
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [useExternal, setUseExternal] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("llama3.1:latest");
  const [documents, setDocuments] = useState<string[]>([]);

  const handleDocumentsProcessed = (processedDocuments: string[]) => {
    setDocuments(processedDocuments);
    setChatHistory((prev) => [
      ...prev,
      { user: "System", bot: "Documents processed and ready for context." },
    ]);
  };

  const handleChatSubmit = async (message: string) => {
    setChatHistory((prev) => [...prev, { user: message, bot: "..." }]);

    try {
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message,
          useExternal,
          apiEndpoint,
          apiKey,
          model,
          documents,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error(`HTTP error! status: ${chatResponse.status}`);
      }

      const data = await chatResponse.json();

      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        {
          user: message,
          bot: data.answer || "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Error submitting chat:", error);

      // Type narrowing for `error`
      if (error instanceof Error) {
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { user: message, bot: `Error: ${error.message}` },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { user: message, bot: "An unknown error occurred." },
        ]);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Chat with Document Context
      </Typography>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useExternal}
              onChange={(e) => setUseExternal(e.target.checked)}
              name="useExternal"
              color="primary"
            />
          }
          label="Use External API"
        />

        {useExternal && (
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="API Endpoint"
              variant="outlined"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="API Key"
              variant="outlined"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Select AI Model</InputLabel>
              <Select
                value={model}
                label="Select AI Model"
                onChange={(e) => setModel(e.target.value)}
              >
                <MenuItem value={"llama3.1:latest"}>Llama 3.1 (Local)</MenuItem>
                <MenuItem value={"phi3:latest"}>phi3:latest</MenuItem>
                <MenuItem value={"gpt-3.5-turbo"}>gpt-3.5-turbo</MenuItem>
                <MenuItem value={"gpt-4"}>gpt-4</MenuItem>
                <MenuItem value={"microsoft/phi-3-medium-128k-instruct:free"}>
                  Phi-3 Medium 128K Instruct
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Paper>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upload Documents for Context
        </Typography>
        <DocumentUploader onDocumentsProcessed={handleDocumentsProcessed} />
      </Paper>

      <Paper
        elevation={3}
        sx={{ padding: 2, marginBottom: 2, maxHeight: 400, overflowY: "auto" }}
      >
        <ChatHistory history={chatHistory} />
      </Paper>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <ChatBox onSubmit={handleChatSubmit} />
      </Paper>
    </Box>
  );
}
