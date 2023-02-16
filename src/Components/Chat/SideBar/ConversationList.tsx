import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { toast } from "react-hot-toast";
import Stack from "@mui/material/Stack";

import ConversationOperations from "../../../graphql/conversations";
import { ConversationData, NewConversationSubscriptionData } from "@/types";
import Conversation from "./Conversation";
import NewConversation from "./NewConversationModel";

const ConversationList = () => {
  const {
    data: ConversationData,
    loading: ConversationLoading,
    error: ConversationError,
    subscribeToMore,
  } = useQuery<ConversationData, {}>(
    ConversationOperations.quires.conversations
  );

  const SubscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, options: NewConversationSubscriptionData) => {
        const subscriptionData = options.subscriptionData;

        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        if (!NewConversation) return prev;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    SubscribeToNewConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ConversationError) toast.error(ConversationError.message);

  if (!ConversationData || !ConversationData.conversations) return <></>;

  return (
    <Stack spacing={1} mx={1}>
      {ConversationData.conversations.map(
        (conversation) =>
          conversation && (
            <Conversation key={conversation.id} conversation={conversation} />
          )
      )}
    </Stack>
  );
};

export default ConversationList;
