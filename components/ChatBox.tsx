// ../components/ChatBox.tsx

import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface ChatBoxProps {
  onSubmit: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        label="Type your message"
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button onClick={handleSubmit} variant="contained">
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
