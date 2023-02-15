import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { Sidebar } from "react-pro-sidebar";
import { grey } from "@mui/material/colors";

import SearchIcon from "@mui/icons-material/Search";

import ConversationList from "./ConversationList";
import UserProfile from "./UserProfile";
import NewConversationModel from "./NewConversationModel";

interface Props {}

const SideBar: React.FC<Props> = () => {
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const closeModel = () => setIsOpenModel(false);
  const openModel = () => setIsOpenModel(true);

  return (
    <Sidebar defaultCollapsed={collapsed}>
      {/* logo and menu icon */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m={1}
      >
        <Typography>Message</Typography>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* user profile */}
      <UserProfile />

      {/* New Conversation input */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor={grey[500]}
        border="1px solid"
        borderColor={grey[700]}
        px={1}
        m={1}
        py={0.25}
        borderRadius="7px"
        sx={{
          cursor: "pointer",
        }}
        onClick={openModel}
      >
        <Typography variant="body2">Find your Friends</Typography>
        <SearchIcon />
      </Box>

      {/* New Conversation Model*/}
      {isOpenModel && (
        <NewConversationModel isOpen={isOpenModel} closeModel={closeModel} />
      )}

      {/* Conversation List */}
      <ConversationList />
    </Sidebar>
  );
};

export default SideBar;
