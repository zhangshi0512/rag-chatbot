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
  const [model, setModel] = useState("phi3:latest");

  const handleChatSubmit = async (message: string) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: message,
        useExternal,
        apiEndpoint,
        apiKey,
        model,
      }),
    });
    const data = await response.json();
    setChatHistory([...chatHistory, { user: message, bot: data.answer }]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
      }}
    >
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
        <Box sx={{ width: "100%", marginBottom: 2 }}>
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
      <DocumentUploader />
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          marginTop: 2,
          overflowY: "auto",
          maxHeight: "400px",
        }}
      >
        <ChatHistory history={chatHistory} />
      </Box>
      <Box sx={{ width: "100%", marginTop: 2 }}>
        <ChatBox onSubmit={handleChatSubmit} />
      </Box>
    </Box>
  );
}
