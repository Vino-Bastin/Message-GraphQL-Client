import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
  id
    participants {
      user {
        id
        name
        image
      }
      hasSeenLatestMessage
    }
    latestMessage {
      ${MessageFields}
    }
    updatedAt
`;

const conversationOperations = {
  quires: {
    conversations: gql`
      query Conversations {
        conversations {
          ${ConversationFields}
        }
      }
    `,
  },
  mutations: {
    createConversation: gql`
      mutation CreateConversation($participantsIds: [String]!) {
        createConversation(participantsIds: $participantsIds) {
          conversationId
        }
      }
    `,
    markConversationAsRead: gql`
      mutation MarkConversationAsRead($conversationId: String!) {
        markConversationAsRead(conversationId: $conversationId)
      }
    `,
    updateConversation: gql`
      mutation UpdateConversation(
        $conversationId: String!
        $participantsIds: [String]!
      ) {
        updateConversation(
          conversationId: $conversationId
          participantsIds: $participantsIds
        )
      }
    `,
    deleteConversation: gql`
      mutation DeleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
         conversationCreated {
          ${ConversationFields}
         } 
      }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversation {
            ${ConversationFields}
          }
          participantsToAdd
          participantsToRemove
        }
      }
    `,

    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          conversationId
        }
      }
    `,
  },
};

export default conversationOperations;
