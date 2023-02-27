import { useLazyQuery, useMutation } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import CloseIcon from "@mui/icons-material/Close";

import ConversationOperations from "@/graphql/conversations";
import {
  SearchUsersInput,
  SearchUsersOutput,
  SearchUsersOutputs,
} from "../../../types";
import UserOperations from "./../../../graphql/user";
import SearchedUserList from "./SearchedUserList";
import SelectedUsers from "./SelectedUsers";
import { ConversationModelContext } from "@/context/ConversationModelContext";
import { Session } from "../../../types";

interface Props {}

const NewConversation: React.FC<Props> = () => {
  const route = useRouter();
  const { data: userData } = useSession();
  const [userInput, setUserInput] = useState<string>("");
  const { isOpen, closeModel, conversation } = useContext(
    ConversationModelContext
  );

  const session = userData as Session;

  const [selectedUsers, setSelectedUsers] = useState<Array<SearchUsersOutput>>(
    conversation
      ? conversation.participants.map((p) => p.user as SearchUsersOutput)
      : []
  );

  /**
   * Queries
   */
  const [query, { data, loading: searchLoading }] = useLazyQuery<
    SearchUsersOutputs,
    SearchUsersInput
  >(UserOperations.quires.searchUsers, {
    onError(error) {
      toast.error(error.message);
    },
  });

  /**
   * Mutations
   */
  const [createConversation, { loading: createLoading }] = useMutation(
    ConversationOperations.mutations.createConversation,
    {
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  const [updateConversation, { loading: updateLoading }] = useMutation(
    ConversationOperations.mutations.updateConversation,
    {
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  // * finding a new user with given name
  const handleSearch = () => {
    query({
      variables: {
        name: userInput,
      },
    });
  };

  // * selecting a new user for a conversation
  const handleAdd = (user: SearchUsersOutput) => {
    for (const u of selectedUsers) {
      if (u.id === user.id) {
        return;
      }
    }

    setSelectedUsers((prev) => [...prev, user]);
  };

  // * removing selected user
  const handleRemove = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // * creating a New Conversation
  const createNewConversation = async (participantsIds: Array<string>) => {
    try {
      const response = await createConversation({
        variables: {
          participantsIds,
        },
      });
      closeModel();
      toast.success(
        response.data.createConversation.isCreated
          ? "New Conversation was created successfully"
          : "Conversation Already Exists"
      );
      route.push({
        query: {
          conversationId: response.data.createConversation.conversationId,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // * updating a Conversation
  const updateConversationHandler = async (participantsIds: Array<string>) => {
    if (!conversation) return toast.error("Conversation not found");

    try {
      await updateConversation({
        variables: {
          conversationId: conversation.id,
          participantsIds,
        },
      });
      closeModel();
      toast.success("Conversation was updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCreate = async () => {
    const participantsIds = selectedUsers.map((u) => u.id);
    if (!conversation) {
      return createNewConversation(participantsIds);
    }

    if (conversation) {
      return updateConversationHandler(participantsIds);
    }
  };

  return (
    <Modal open={isOpen} onClose={closeModel}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: grey[700],
          border: "none",
          boxShadow: 24,
          pt: 2,
          px: 4,
          pb: 3,
          borderRadius: 2,
          ["&:focus"]: {
            border: "none",
            outline: "none",
          },
        }}
      >
        {/* model header & close button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">Create a New Conversation</Typography>
          <IconButton onClick={closeModel}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* input & search button */}
        <Stack spacing={1}>
          <Input
            placeholder="Enter your friend name"
            type="text"
            sx={{
              color: "grey.200",
              px: 1,
            }}
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />
          <LoadingButton
            loading={searchLoading}
            onClick={handleSearch}
            disabled={userInput === ""}
            variant="contained"
          >
            Search
          </LoadingButton>
        </Stack>

        {/* user list the given input */}
        {data && (
          <SearchedUserList data={data.searchUsers} handleAdd={handleAdd} />
        )}

        {/* selected Users */}
        {selectedUsers.length > 0 && (
          <SelectedUsers data={selectedUsers} handleRemove={handleRemove} />
        )}

        {/* create button */}
        {selectedUsers.length > 0 && (
          <LoadingButton
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            variant="contained"
            onClick={handleCreate}
            loading={createLoading || updateLoading}
          >
            {conversation ? "Update" : "Create"}
          </LoadingButton>
        )}
      </Box>
    </Modal>
  );
};

export default NewConversation;
