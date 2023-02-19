import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { grey } from "@mui/material/colors";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { SearchUsersOutput } from "@/types";

interface Props {
  data: SearchUsersOutput[];
  handleRemove: (id: string) => void;
}

const SelectedUsers: React.FC<Props> = ({ data, handleRemove }) => {
  return (
    <Box
      sx={{
        flexWrap: "wrap",
        display: "flex",
        mt: 1,
      }}
    >
      {data.map((user) => (
        <Box key={user.id} display="flex" alignItems="center" m={0.5} p={0.5}>
          <Typography variant="body2" color={grey[50]}>
            {user.name}
          </Typography>
          <IconButton size="small" onClick={() => handleRemove(user.id)}>
            <HighlightOffIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default SelectedUsers;
