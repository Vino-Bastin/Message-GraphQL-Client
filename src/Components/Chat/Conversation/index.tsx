import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { grey } from "@mui/material/colors";
import { signOut } from "next-auth/react";

import ConversationModelProvider from "@/context/ConversationModel";
import ConversationList from "./ConversationList";
import UserProfile from "./UserProfile";
import NewConversation from "./NewConversation";

interface Props {}

const SideBar: React.FC<Props> = () => {
  const router = useRouter();
  const theme = useTheme();

  const { conversationId } = router.query;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        bgcolor: grey[600],
        width: "300px",
        minWidth: "300px",
        [theme.breakpoints.down("sm")]: {
          display: conversationId ? "none" : "flex",
          width: "100%",
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

        {/* Conversation Model Provider */}
        <ConversationModelProvider>
          {/* New Conversation input */}
          <NewConversation />
          {/* Conversation List */}
          <ConversationList />
        </ConversationModelProvider>
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
