import React, { useEffect } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { toast } from "react-hot-toast";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";

import ConversationOperations from "../../../graphql/conversations";
import MessageOperations from "../../../graphql/message";
import {
  ConversationData,
  ConversationUpdateData,
  NewConversationSubscriptionData,
  MessageData,
  ConversationParticipant,
  Session,
  ConversationDeletedSubscriptionPayload,
  Conversation as ConversationType,
} from "@/types";
import Conversation from "./Conversation";
import NewConversation from "./NewConversationModel";
import conversationOperations from "../../../graphql/conversations";

const ConversationList: React.FC = () => {
  const router = useRouter();
  const { data } = useSession();

  const session = data as Session;

  /**
   * Queries
   */
  // * get all conversations
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

  /**
   * Mutations
   */
  // * mark conversation as read
  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { conversationId: string }
  >(ConversationOperations.mutations.markConversationAsRead);

  /*
   ** Subscriptions
   */
  //  * Conversation Updated Subscription
  useSubscription<ConversationUpdateData>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversation: updatedConversation,
          participantsToAdd,
          participantsToRemove,
        } = subscriptionData.conversationUpdated;

        const { id: updatedConversationId, latestMessage } =
          updatedConversation;

        // * user was removed from the conversation
        if (participantsToRemove && participantsToRemove.length) {
          const isRemoved = participantsToRemove.find(
            (id) => id === session.user.id
          );

          if (isRemoved) {
            const existing = client.readQuery<ConversationData>({
              query: ConversationOperations.quires.conversations,
            });

            if (!existing) return;

            client.writeQuery<ConversationData>({
              query: ConversationOperations.quires.conversations,
              data: {
                conversations: existing.conversations.filter(
                  (conversation) => conversation.id !== updatedConversationId
                ),
              },
            });

            if (updatedConversationId === router.query.conversationId)
              router.replace("/");
          }
          return;
        }

        // * user was added to the conversation
        if (participantsToAdd && participantsToAdd.length) {
          const isAdded = participantsToAdd.find(
            (id) => id === session.user.id
          );

          if (isAdded) {
            const existing = client.readQuery<ConversationData>({
              query: ConversationOperations.quires.conversations,
            });

            if (!existing) return;

            client.writeQuery<ConversationData>({
              query: ConversationOperations.quires.conversations,
              data: {
                conversations: [updatedConversation, ...existing.conversations],
              },
            });
          }

          return;
        }

        // * conversation was updated with new message
        // * user viewing the conversation so no need to update the message cache
        if (updatedConversationId === router.query.conversationId) {
          handleMarkAsRead(updatedConversationId, false);
          return;
        }

        // * update the message cache with latest message
        // * no need to update the conversation cache since the message cache will be updated

        const existing = client.readQuery<MessageData>({
          query: MessageOperations.queries.messages,
          variables: { conversationId: updatedConversationId },
        });

        // * no messages in the cache
        if (!existing) return;

        // * check if the message is already in the cache
        const messageExists = existing.messages.find(
          (message) => message.id === latestMessage.id
        );

        if (!messageExists) {
          client.writeQuery<MessageData>({
            query: MessageOperations.queries.messages,
            variables: { conversationId: updatedConversation.id },
            data: {
              ...existing,
              messages: [latestMessage, ...existing.messages],
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

  // * Conversation Deleted Subscription
  useSubscription<ConversationDeletedSubscriptionPayload, {}>(
    ConversationOperations.Subscriptions.conversationOnDeleted,
    {
      onData: ({ client, data }) => {
        if (!data.data) return;
        const { id: conversationId } = data.data.conversationOnDeleted;
        if (!conversationId) return;

        // * update the conversation cache

        const existing = client.readQuery<ConversationData>({
          query: ConversationOperations.quires.conversations,
        });

        if (!existing) return;

        if (conversationId === router.query.conversationId) router.replace("/");

        client.writeQuery<ConversationData>({
          query: ConversationOperations.quires.conversations,
          data: {
            conversations: existing.conversations.filter(
              (conversation) => conversation.id !== conversationId
            ),
          },
        });
      },
    }
  );

  /**
   * Handlers
   */
  // * marking conversation as read
  const handleMarkAsRead = async (
    conversationId: string,
    hasSeenTheMessage: boolean
  ) => {
    router.push({
      query: {
        conversationId,
      },
    });

    if (hasSeenTheMessage) return;

    try {
      await markConversationAsRead({
        variables: {
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          const participantFragment = cache.readFragment<{
            participants: Array<ConversationParticipant>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: conversationOperations.fragment.conversationParticipants,
          });

          if (!participantFragment) return;

          const participants = [...participantFragment.participants];

          const index = participants.findIndex(
            (participant) => participant.user.id === session.user.id
          );

          if (index === -1) return;

          participants[index] = {
            ...participants[index],
            hasSeenLatestMessage: true,
          };

          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment:
              conversationOperations.fragment.updateConversationParticipants,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
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
      {ConversationData.conversations.length === 0 && (
        <Box
          sx={{
            height: "100px",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Typography color="grey.200" variant="h6" fontSize={14}>
            No Conversations
          </Typography>
        </Box>
      )}
      {ConversationData.conversations.map(
        (conversation) =>
          conversation && (
            <Conversation
              key={conversation.id}
              conversation={conversation}
              onViewConversation={handleMarkAsRead}
            />
          )
      )}
    </Stack>
  );
};

export default React.memo(ConversationList);
