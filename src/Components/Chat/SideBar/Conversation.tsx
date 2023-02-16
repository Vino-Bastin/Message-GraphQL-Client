import React from "react";
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { grey } from "@mui/material/colors";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { Conversation } from "@/types";
import {
  formatParticipantNames,
  getConversationProfileImage,
} from "../../../util/functions";

interface Props {
  conversation: Conversation | null;
}

const DateFormat = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yyyy",
};

const Conversation: React.FC<Props> = ({ conversation }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const { conversationId } = router.query;

  const handleClick = () => {
    router.push({
      query: {
        conversationId: conversation?.id,
      },
    });
  };

  if (!conversation) return <></>;

  return (
    <Box
      sx={{
        display: "flex",
        cursor: "pointer",
        bgcolor: conversationId === conversation.id ? grey[500] : "transparent",
        p: 1,
        borderRadius: 2,
        justifyContent: "space-between",
        alignItems: "center",
        color: "grey.100",
        ["&:hover"]: {
          bgcolor: grey[500],
        },
      }}
      onClick={handleClick}
    >
      <Box display="flex">
        <Avatar
          src={getConversationProfileImage(
            conversation.participants,
            session?.user?.name
          )}
        />
        <Typography variant="body1" pl={1}>
          {formatParticipantNames(
            conversation.participants,
            session?.user?.name
          )}
        </Typography>
      </Box>
      <Typography variant="body2" pl={1} fontSize="0.8rem">
        {formatRelative(new Date(conversation.updatedAt), new Date(), {
          locale: {
            ...enUS,
            formatRelative: (token) =>
              DateFormat[token as keyof typeof DateFormat],
          },
        })}
      </Typography>
    </Box>
  );
};

export default Conversation;
