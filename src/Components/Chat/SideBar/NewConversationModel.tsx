import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SearchedUserList from "./SearchedUserList";

interface Props {}

const NewConversation: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor={grey[500]}
        border="1px solid"
        borderColor={grey[700]}
        px={1}
        m={1}
        py={0.25}
        borderRadius="7px"
        sx={{
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(true)}
      >
        <Typography variant="body2">Find your Friends</Typography>
        <SearchIcon />
      </Box>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">Create a New Conversation</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* input & search button */}
          <Stack spacing={1}>
            <Input placeholder="Enter your friend name" type="text" />
            <Button variant="contained">Search</Button>
          </Stack>

          {/* user list the given input */}
          <SearchedUserList />
        </Box>
      </Modal>
    </>
  );
};

export default NewConversation;
