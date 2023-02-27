import { Conversation } from "@/types";
import React, { createContext } from "react";

export interface ConversationModelContextInterface {
  isOpen: boolean;
  conversation: Conversation | null;
  openModel: () => void;
  closeModel: () => void;
  setConversationData: (data: Conversation) => void;
}

interface Props {
  children: React.ReactNode;
}

export const ConversationModelContext =
  createContext<ConversationModelContextInterface>({
    conversation: null,
    isOpen: false,
    openModel: () => {},
    closeModel: () => {},
    setConversationData: () => {},
  });

const ConversationModelProvider: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [conversation, setConversation] = React.useState<Conversation | null>(
    null
  );

  const openModel = () => setIsOpen(true);

  const closeModel = () => {
    setConversation(null);
    setIsOpen(false);
  };

  const setConversationData = (data: Conversation) => setConversation(data);

  return (
    <ConversationModelContext.Provider
      value={{
        conversation,
        isOpen,
        openModel,
        closeModel,
        setConversationData,
      }}
    >
      {children}
    </ConversationModelContext.Provider>
  );
};

export default ConversationModelProvider;
