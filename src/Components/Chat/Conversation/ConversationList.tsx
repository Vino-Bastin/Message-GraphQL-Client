import React, { useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { toast } from "react-hot-toast";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

import ConversationOperations from "../../../graphql/conversations";
import MessageOperations from "../../../graphql/message";
import {
  ConversationData,
  ConversationUpdateData,
  NewConversationSubscriptionData,
  MessageData,
} from "@/types";
import Conversation from "./Conversation";
import NewConversation from "./NewConversationModel";

const ConversationList = () => {
  const router = useRouter();

  const {
    data: ConversationData,
    loading: ConversationLoading,
    error: ConversationError,
    subscribeToMore,
  } = useQuery<ConversationData, {}>(
    ConversationOperations.quires.conversations,
    {
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  /*
   ** Subscriptions
   */

  //  * Conversation Updated Subscription
  useSubscription<ConversationUpdateData>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        if (!data.data) return;

        const {
          conversation: updatedConversation,
          participantsToAdd,
          participantsToRemove,
        } = data.data.conversationUpdated;

        // * user was added to the conversation
        if (participantsToAdd && participantsToAdd.length) return;

        // * user was removed from the conversation
        if (participantsToRemove && participantsToRemove.length) return;

        // * conversation was updated with new message
        // * user viewing the conversation so no need to update the message cache
        if (updatedConversation.id === router.query.conversationId) return;

        // * update the message cache with latest message
        // * no need to update the conversation cache since the message cache will be updated

        const existing = client.readQuery<MessageData>({
          query: MessageOperations.queries.messages,
          variables: { conversationId: updatedConversation.id },
        });

        // * no messages in the cache
        if (!existing) return;

        // * check if the message is already in the cache
        const messageExists = existing.messages.find(
          (message) => message.id === updatedConversation.latestMessageId
        );

        if (!messageExists) {
          client.writeQuery<MessageData>({
            query: MessageOperations.queries.messages,
            variables: { conversationId: updatedConversation.id },
            data: {
              ...existing,
              messages: [
                updatedConversation.latestMessage,
                ...existing.messages,
              ],
            },
          });
        }
      },
    }
  );

  //  * New Conversation Subscription
  const SubscribeToNewConversations = () => {
    return subscribeToMore({
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
    const unSubscribe = SubscribeToNewConversations();
    return () => unSubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ConversationData || !ConversationData.conversations) return <></>;

  return (
    <Stack spacing={1} mx={1}>
      <Typography color="grey.200" variant="h6" fontSize={14}>
        Conversations
      </Typography>
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
