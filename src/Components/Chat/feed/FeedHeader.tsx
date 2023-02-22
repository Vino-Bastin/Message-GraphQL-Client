import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";

import ConversationOperations from "@/graphql/conversations";
import { formatParticipantNames } from "../../../util/functions";
import { ConversationData, Session } from "@/types";

interface Props {}

const FeedHeader: React.FC<Props> = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data: userData } = useSession();

  const { data, loading, error } = useQuery<ConversationData>(
    ConversationOperations.quires.conversations
  );

  const { conversationId } = router.query;

  const back = () => router.replace("/");

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  const {
    user: { id },
  } = userData as Session;

  if (!userData) return <></>;

  if (!conversationId) back();

  if (loading) return <></>;

  if (error || !conversation) back();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        borderBottom: "2px solid",
        borderColor: "grey.800",
        p: 1,
      }}
    >
      <Box
        sx={{
          display: "none",
          [theme.breakpoints.down("sm")]: {
            display: "flex",
            marginRight: "5px",
          },
        }}
      >
        <Button variant="contained" onClick={back}>
          Back
        </Button>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" color="gray.800">
          To :
        </Typography>
        <Typography ml={1} variant="h6" color="whitesmoke">
          {conversation &&
            formatParticipantNames(conversation.participants, id)}
        </Typography>
      </Box>
    </Box>
  );
};

export default FeedHeader;
