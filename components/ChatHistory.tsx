// ../components/ChatHistory.tsx

import React from "react";
import { Box, Typography } from "@mui/material";

interface ChatEntry {
  user: string;
  bot: string;
}

interface ChatHistoryProps {
  history: ChatEntry[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history }) => {
  return (
    <Box>
      {history.map((entry, index) => (
        <Box key={index} sx={{ my: 2 }}>
          <Typography variant="body1">
            <strong>You:</strong> {entry.user}
          </Typography>
          <Typography variant="body1">
            <strong>Bot:</strong> {entry.bot}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ChatHistory;
