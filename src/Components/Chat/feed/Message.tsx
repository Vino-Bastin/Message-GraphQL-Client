import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";
import { blue } from "@mui/material/colors";

import { Message } from "@/types";
import { formatRelativeLocale } from "../../../util/constant";

interface Props {
  message: Message;
  sendByMe: boolean;
}

const Message: React.FC<Props> = ({ message, sendByMe }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: sendByMe ? "flex-end" : "flex-start",
        width: "100%",
        padding: "1rem",
      }}
    >
      <Box display="flex" alignItems="center" maxWidth="65%">
        {!sendByMe && (
          <Avatar
            sx={{
              width: "2rem",
              height: "2rem",
              marginRight: "0.5rem",
            }}
            src={message.sender.image as string}
          />
        )}
        <Box
          display="flex"
          flexDirection="column"
          alignItems={sendByMe ? "flex-end" : "flex-start"}
        >
          <Box display="flex">
            {!sendByMe && (
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginRight: "0.5rem",
                }}
              >
                {message.sender.name}
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                marginRight: "0.5rem",
              }}
            >
              {formatRelative(new Date(message.createdAt), new Date(), {
                locale: {
                  ...enUS,
                  formatRelative: (token) =>
                    formatRelativeLocale[
                      token as keyof typeof formatRelativeLocale
                    ],
                },
              })}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            bgcolor={sendByMe ? "" : "blue"}
            sx={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              color: sendByMe ? "" : "white",
              backgroundColor: sendByMe ? "" : blue[800],
              wordBreak: "break-word",
            }}
          >
            {message.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
