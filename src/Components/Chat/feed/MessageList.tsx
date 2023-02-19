import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import messageOperations from "@/graphql/message";
import { MessageData, MessageSubscriptionData, User } from "@/types";
import Message from "./Message";

const MessageList = () => {
  const router = useRouter();
  const { conversationId } = router.query;
  const { data: userData } = useSession();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { data, loading, subscribeToMore, error } = useQuery<
    MessageData,
    { conversationId: string }
  >(messageOperations.queries.messages, {
    variables: { conversationId: conversationId as string },

    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const user = userData?.user as User;

  const subscribeToNewMessages = (conversationId: string) => {
    return subscribeToMore({
      document: messageOperations.subscriptions.messageCreated,
      variables: { conversationId },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageCreated;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === user.id
              ? prev.messages
              : [...prev.messages, newMessage],
        });
      },
    });
  };

  useEffect(() => {
    const unSubscribe = subscribeToNewMessages(conversationId as string);

    return () => unSubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  if (!conversationId) return null;

  if (loading) return <Box>Loading...</Box>;

  if (error) return <Box>{error.message}</Box>;

  return (
    <Box overflow="auto">
      {data?.messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          sendByMe={message.sender.id === user.id}
        />
      ))}
      <div ref={scrollRef} />
    </Box>
  );
};

export default MessageList;
