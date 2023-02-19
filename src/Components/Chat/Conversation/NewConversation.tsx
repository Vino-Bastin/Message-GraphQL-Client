import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import NewConversationModel from "./NewConversationModel";

import SearchIcon from "@mui/icons-material/Search";

const NewConversation = () => {
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);

  const closeModel = () => setIsOpenModel(false);
  const openModel = () => setIsOpenModel(true);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="grey.500"
        px={1}
        m={1}
        py={0.25}
        color="grey.200"
        borderRadius="7px"
        sx={{
          cursor: "pointer",
        }}
        onClick={openModel}
      >
        <Typography variant="body2">Find your Friends</Typography>
        <SearchIcon />
      </Box>

      {/* New Conversation Model*/}
      {isOpenModel && (
        <NewConversationModel isOpen={isOpenModel} closeModel={closeModel} />
      )}
    </>
  );
};

export default NewConversation;
