import { gql } from "@apollo/client";

const ConversationFields = `
  id
    participants {
      user {
        id
        name
        image
      }
      hasSeenLastMessage
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
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
         conversationCreated {
          ${ConversationFields}
         } 
      }
    `,
  },
};

export default conversationOperations;
