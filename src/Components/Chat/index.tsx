import React from "react";
import Box from "@mui/system/Box";
import SideBar from "./SideBar";
import { ProSidebarProvider } from "react-pro-sidebar";

interface Props {}

const Chat: React.FC<Props> = () => {
  return (
    <ProSidebarProvider>
      <Box height="100vh" display="flex">
        <SideBar />
      </Box>
    </ProSidebarProvider>
  );
};

export default Chat;
