import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

import MessageList from "./MessageList";
import Input from "./Input";
import FeedHeader from "./FeedHeader";
import { useTheme } from "@mui/material";

interface Props {}

const Feed: React.FC<Props> = () => {
  const router = useRouter();
  const theme = useTheme();

  const { conversationId } = router.query;

  if (!conversationId)
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "grey.200",
          [theme.breakpoints.down("sm")]: {
            display: conversationId ? "flex" : "none",
          },
        }}
      >
        <Typography variant="h6">Select a conversation </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        p: 1,
      }}
    >
      <FeedHeader />
      <MessageList />
      <Input />
    </Box>
  );
};

export default Feed;
