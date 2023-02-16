import { IconButton, Input, InputAdornment } from "@mui/material";
import React, { useState } from "react";

import SendIcon from "@mui/icons-material/Send";

const NewMessage = () => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
        placeholder="New Message"
        fullWidth
        sx={{ color: "grey.200", px: 1, my: 0.25 }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              type="submit"
              sx={{ color: "grey.200" }}
              aria-label="send message"
              disabled={!message}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </form>
  );
};

export default NewMessage;
