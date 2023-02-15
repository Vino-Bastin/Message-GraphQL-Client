// * import some types from the backend
import {
  ConversationPopulated,
  ConversationParticipantPopulated,
} from "../../../server/src/types";

// * users
export interface SearchUsersInput {
  name: string;
}

export interface SearchUsersOutput {
  id: string;
  name: string;
  image: string;
}

export interface SearchUsersOutputs {
  searchUsers: SearchUsersOutput[];
}

// * conversation types

export interface Conversation extends ConversationPopulated {}

export interface ConversationParticipant
  extends ConversationParticipantPopulated {}

export interface ConversationData {
  conversations: Array<ConversationPopulated>;
}

export interface CreateConversationInput {
  participantIds: Array<String>;
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface NewConversationSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: ConversationPopulated;
    };
  };
}
