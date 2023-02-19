import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { grey } from "@mui/material/colors";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { Conversation, Session } from "@/types";
import {
  formatParticipantNames,
  getConversationProfileImage,
} from "@/util/functions";
import { formatRelativeLocale } from "../../../util/constant";

interface Props {
  conversation: Conversation | null;
}

const Conversation: React.FC<Props> = ({ conversation }) => {
  const { data } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const session = data as Session;
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
      ref={anchorRef}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
    >
      {showMenu && (
        <Popover
          anchorEl={anchorRef.current}
          open={showMenu}
          onClose={() => setShowMenu(false)}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              p: 1,
              bgcolor: "grey.700",
            }}
          >
            <Button sx={{ width: "100%" }} variant="contained">
              Edit
            </Button>
            <Button sx={{ width: "100%" }} variant="contained">
              Delete
            </Button>
          </Box>
        </Popover>
      )}

      <Box display="flex">
        <Avatar
          src={getConversationProfileImage(
            conversation.participants,
            session.user.id
          )}
        />
        <Box pl={1} display="flex" gap={0.2} flexDirection="column">
          <Typography variant="body1">
            {formatParticipantNames(conversation.participants, session.user.id)}
          </Typography>
          <Typography variant="body1" fontSize="0.8rem">
            {conversation.latestMessage?.content}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" pl={1} fontSize="0.8rem">
        {formatRelative(new Date(conversation.updatedAt), new Date(), {
          locale: {
            ...enUS,
            formatRelative: (token) =>
              formatRelativeLocale[token as keyof typeof formatRelativeLocale],
          },
        })}
      </Typography>
    </Box>
  );
};

export default Conversation;
