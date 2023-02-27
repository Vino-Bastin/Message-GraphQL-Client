"use client";

import Box from "@mui/material/Box";
import React from "react";

import SideBar from "./Conversation";
import Feed from "./feed";

const Chat: React.FC = () => {
  return (
    <Box height="100vh" display="flex">
      <SideBar />
      <Feed />
    </Box>
  );
};

export default Chat;
