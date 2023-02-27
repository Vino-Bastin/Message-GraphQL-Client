import { useQuery } from "@apollo/client";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import ConversationOperations from "@/graphql/conversations";
import { ConversationData, Session } from "@/types";
import { formatParticipantNames } from "../../../util/functions";

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

  if (!conversationId || error) back();

  if (!loading && !conversation) back();

  if (loading) return <></>;

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
