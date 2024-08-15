import React, { useState } from "react";
import { TextField, Box, Button } from "@mui/material";

interface InputBoxProps {
  onSubmit: (message: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSubmit }) => {
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      onSubmit(input);
      setInput("");
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        label="Type your message"
        variant="outlined"
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <Button variant="contained" onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
};

export default InputBox;
