import { ConversationParticipant } from "@/types";

export const formatParticipantNames = (
  participants: Array<ConversationParticipant>,
  userId: string
): string => {
  return (
    participants
      .filter((participant) => participant.user.id !== userId)
      .map((participant) => participant.user.name)
      .join(",") || "No participants"
  );
};

export const getConversationProfileImage = (
  participants: Array<ConversationParticipant>,
  userId: string
): string => {
  if (participants.length > 2) return "";

  return (
    (participants.filter((participant) => participant.user.id !== userId)[0]
      ?.user.image as string) || ""
  );
};

export const isUserSeenTheLatestMessage = (
  participants: Array<ConversationParticipant>,
  userId: string
): boolean => {
  return participants.filter((participant) => participant.user.id === userId)[0]
    ?.hasSeenLatestMessage;
};
