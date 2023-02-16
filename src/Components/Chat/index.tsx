import React from "react";
import Box from "@mui/material/Box";
import { ProSidebarProvider } from "react-pro-sidebar";

import Feed from "./feed";
import SideBar from "./SideBar";

interface Props {}

const Chat: React.FC<Props> = () => {
  return (
    <ProSidebarProvider>
      <Box height="100vh" display="flex">
        <SideBar />
        <Feed />
      </Box>
    </ProSidebarProvider>
  );
};

export default Chat;
