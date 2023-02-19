import { useLazyQuery, useMutation } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import CloseIcon from "@mui/icons-material/Close";

import conversationOperations from "@/graphql/conversations";
import {
  SearchUsersInput,
  SearchUsersOutput,
  SearchUsersOutputs,
} from "../../../types";
import userOperations from "./../../../graphql/user";
import SearchedUserList from "./SearchedUserList";
import SelectedUsers from "./SelectedUsers";

interface Props {
  isOpen: boolean;
  closeModel: () => void;
}

const NewConversation: React.FC<Props> = ({ closeModel, isOpen }) => {
  const route = useRouter();
  const [userInput, setUserInput] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<Array<SearchUsersOutput>>(
    []
  );

  const [query, { data, loading: searchLoading, error }] = useLazyQuery<
    SearchUsersOutputs,
    SearchUsersInput
  >(userOperations.quires.searchUsers);

  const [createConversation, { loading: createLoading }] = useMutation(
    conversationOperations.mutations.createConversation
  );

  // * showing error message if any error occurred
  if (error) toast.error(error.message);

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
  const handleCreate = async () => {
    const participantsIds = selectedUsers.map((u) => u.id);
    try {
      const response = await createConversation({
        variables: {
          participantsIds,
        },
      });
      closeModel();
      toast.success("New Conversation was created successfully");
      route.push({
        query: {
          conversationId: response.data.createConversation.conversationId,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
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
            loading={createLoading}
          >
            Create
          </LoadingButton>
        )}
      </Box>
    </Modal>
  );
};

export default NewConversation;
