import { gql } from "@apollo/client";

export const MessageFields = `
    id
    content
    createdAt
    sender {
        id
        name
        image
    }
`;

const messageOperations = {
  queries: {
    messages: gql`
      query Messages($conversationId: String!) {
        messages(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
  },
  mutations: {
    createMessage: gql`
      mutation CreateMessage($conversationId: String!, $content: String!) {
        createMessage(conversationId: $conversationId, content: $content)
      }
    `,
  },
  subscriptions: {
    messageCreated: gql`
      subscription MessageCreated($conversationId: String!) {
        messageCreated(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
  },
};

export default messageOperations;
