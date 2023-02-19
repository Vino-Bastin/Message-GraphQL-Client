import { IconButton, Input, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { ObjectId } from "bson";
import { useSession } from "next-auth/react";

import SendIcon from "@mui/icons-material/Send";

import messageOperations from "@/graphql/message";
import { CreateMessageInput, MessageData, User } from "@/types";

const NewMessage = () => {
  const router = useRouter();
  const { conversationId } = router.query;

  const { data } = useSession();

  const user = data?.user as User;

  const [message, setMessage] = useState<string>("");

  const [sendMessage] = useMutation<
    { createMessage: boolean },
    CreateMessageInput
  >(messageOperations.mutations.createMessage);

  if (!conversationId) return null;

  // * send message
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, errors } = await sendMessage({
        variables: {
          conversationId: conversationId as string,
          content: message,
        },
        optimisticResponse: {
          createMessage: true,
        },
        update: (cache, { data }) => {
          setMessage("");
          const existingMessages = cache.readQuery<MessageData>({
            query: messageOperations.queries.messages,
            variables: { conversationId: conversationId as string },
          }) as MessageData;

          cache.writeQuery<MessageData, { conversationId: string }>({
            query: messageOperations.queries.messages,
            variables: { conversationId: conversationId as string },
            data: {
              ...existingMessages,
              messages: [
                ...existingMessages.messages,
                {
                  id: new ObjectId().toString(),
                  content: message,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  conversationId: conversationId as string,
                  senderId: user?.id,
                  sender: user,
                },
              ],
            },
          });
        },

        // ! TODO: fix the rollback of the optimistic response when the mutation fails
      });

      if (errors || !data?.createMessage)
        throw new Error("Error sending message");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
        placeholder="New Message"
        fullWidth
        sx={{ color: "grey.200", px: 1, my: 0.25 }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              type="submit"
              sx={{ color: "grey.200" }}
              aria-label="send message"
              disabled={!message}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </form>
  );
};

export default NewMessage;
