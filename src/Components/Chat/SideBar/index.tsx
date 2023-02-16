import { Box, Button, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import { grey } from "@mui/material/colors";
import { signOut } from "next-auth/react";

import SearchIcon from "@mui/icons-material/Search";

import ConversationList from "./ConversationList";
import UserProfile from "./UserProfile";
import NewConversationModel from "./NewConversationModel";

interface Props {}

const SideBar: React.FC<Props> = () => {
  const router = useRouter();
  const theme = useTheme();
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);

  const { conversationId } = router.query;

  const closeModel = () => setIsOpenModel(false);
  const openModel = () => setIsOpenModel(true);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        bgcolor: grey[600],
        [theme.breakpoints.down("sm")]: {
          display: conversationId ? "none" : "flex",
          width: "100%",
        },
        [theme.breakpoints.up("md")]: {
          width: "40%",
        },
        [theme.breakpoints.up("lg")]: {
          width: "30%",
        },
      }}
    >
      {/* logo and menu icon */}
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          m={1}
        >
          <Typography color="grey.200" variant="h6">
            Message
          </Typography>
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
      </Box>

      {/* Log Out */}
      <Box display="flex">
        <Button
          fullWidth
          variant="contained"
          sx={{ mx: 1, my: 0.5 }}
          onClick={() => signOut()}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
};

export default SideBar;
