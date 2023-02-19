import React from "react";
import Box from "@mui/material/Box";

import Feed from "./feed";
import SideBar from "./Conversation";

interface Props {}

const Chat: React.FC<Props> = () => {
  return (
    <Box height="100vh" display="flex">
      <SideBar />
      <Feed />
    </Box>
  );
};

export default Chat;
