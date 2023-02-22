// * import some types from the backend
import {
  ConversationPopulated,
  ConversationParticipantPopulated,
  MessagePopulated,
} from "../../../server/src/types";

// * users
export interface User {
  id: string;
  name: string;
  image: string;
  email: string;
}

export interface Session {
  user: User;
  expires: string;
}

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
    isCreated: boolean;
  };
}

export interface NewConversationSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: ConversationPopulated;
    };
  };
}

export interface ConversationUpdateData {
  conversationUpdated: {
    conversation: Omit<ConversationPopulated, "latestMessage"> & {
      latestMessage: MessagePopulated;
    };
    participantsToAdd: Array<string> | null;
    participantsToRemove: Array<string> | null;
  };
}

export interface ConversationDeletedSubscriptionPayload {
  conversationOnDeleted: {
    id: string;
  };
}

// * message types
export interface MessageData {
  messages: Array<MessagePopulated>;
}

export interface CreateMessageInput {
  conversationId: string;
  content: string;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageCreated: MessagePopulated;
    };
  };
}

export interface Message extends MessagePopulated {}
