import { ConversationParticipant } from "@/types";

export const formatParticipantNames = (
  participants: Array<ConversationParticipant>,
  myName: string | null | undefined
): string => {
  return participants
    .filter((participant) => participant.user.name !== myName)
    .map((participant) => participant.user.name)
    .join(",");
};

export const getConversationProfileImage = (
  participants: Array<ConversationParticipant>,
  myName: string | null | undefined
): string => {
  if (participants.length > 2) return "";

  return participants.filter(
    (participant) => participant.user.name !== myName
  )[0].user.image as string;
};
