import React from "react";
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useSession } from "next-auth/react";

import { Conversation } from "@/types";
import {
  formatParticipantNames,
  getConversationProfileImage,
} from "../../../util/functions";

interface Props {
  data: Conversation | null;
}

const Conversation: React.FC<Props> = ({ data }) => {
  const { data: session } = useSession();

  if (!data) return <></>;

  return (
    <Box display="flex">
      <Avatar
        src={getConversationProfileImage(
          data.participants,
          session?.user?.name
        )}
      />
      <Typography variant="body1" pl={1}>
        {formatParticipantNames(data.participants, session?.user?.name)}
      </Typography>
    </Box>
  );
};

export default Conversation;
