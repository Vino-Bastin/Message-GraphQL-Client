import { useMutation } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import conversationOperations from "@/graphql/conversations";
import { Conversation, Session } from "@/types";
import {
  formatParticipantNames,
  getConversationProfileImage,
  isUserSeenTheLatestMessage,
} from "@/util/functions";
import { ConversationModelContext } from "../../../context/ConversationModelContext";
import { formatRelativeLocale } from "../../../util/constant";

interface Props {
  conversation: Conversation;
  onViewConversation: (
    conversationId: string,
    hasSeenThenMessage: boolean
  ) => void;
}

const Conversation: React.FC<Props> = ({
  conversation,
  onViewConversation,
}) => {
  const { data } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { openModel, setConversationData } = useContext(
    ConversationModelContext
  );

  const [deleteConversation, { loading }] = useMutation<
    { deleteConversation: boolean },
    {
      conversationId: string;
    }
  >(conversationOperations.mutations.deleteConversation);

  const session = data as Session;
  const { conversationId } = router.query;

  const hasSeenTheLatestMessage = isUserSeenTheLatestMessage(
    conversation.participants,
    session.user.id
  );

  // * handle conversation delete
  const handleDeleteConversation = async () => {
    try {
      const response = await deleteConversation({
        variables: {
          conversationId: conversation.id,
        },
      });

      if (response.data?.deleteConversation) {
        toast.success("Conversation deleted successfully");
      }

      setShowMenu(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // * handle conversation click
  const handleClick = () => {
    onViewConversation(conversation.id, hasSeenTheLatestMessage);
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
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
        e.stopPropagation();
        setShowMenu(true);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-4px",
          right: "2px",
        }}
      >
        <Tooltip title="Edit">
          <EditIcon
            sx={{
              width: "17px",
              height: "17px",
              color: "grey.900",
              cursor: "pointer",
              display: "none",
              [theme.breakpoints.down("md")]: {
                display: "block",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(true);
            }}
          />
        </Tooltip>
      </Box>

      {showMenu && (
        <Popover
          anchorEl={anchorRef.current}
          open={showMenu}
          onClose={(e) => setShowMenu(false)}
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
            <Button
              sx={{
                width: "100px",
                height: "35px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setConversationData(conversation);
                openModel();
              }}
            >
              Edit
              <EditIcon
                sx={{
                  width: "17px",
                  height: "17px",
                }}
              />
            </Button>
            <LoadingButton
              sx={{
                width: "100%",
                height: "35px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              variant="contained"
              loading={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConversation();
              }}
            >
              Delete
              <DeleteIcon
                sx={{
                  width: "17px",
                  height: "17px",
                }}
              />
            </LoadingButton>
          </Box>
        </Popover>
      )}

      <Box display="flex" pl="10px">
        {!hasSeenTheLatestMessage && (
          <Box
            sx={{
              position: "absolute",
              top: "40%",
              left: "5px",
              width: 10,
              height: 10,
              bgcolor: "success.main",
              borderRadius: "50%",
            }}
          />
        )}
        <Avatar
          src={getConversationProfileImage(
            conversation.participants,
            session.user.id
          )}
        />
        <Box pl={1} display="flex" gap={0.2} flexDirection="column">
          <Typography
            variant="body1"
            textOverflow="ellipsis"
            overflow="hidden !important"
            display="inline-block"
            whiteSpace="nowrap"
            maxWidth="100px"
          >
            {formatParticipantNames(conversation.participants, session.user.id)}
          </Typography>
          <Typography
            variant="body1"
            fontSize="0.8rem"
            textOverflow="ellipsis"
            overflow="hidden !important"
            display="inline-block"
            whiteSpace="nowrap"
            maxWidth="100px"
          >
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
