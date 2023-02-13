import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface Props {}

const SearchedUserList: React.FC<Props> = () => {
  const data = [
    {
      id: 1,
      name: "vinobastin",
      image: "",
    },
    {
      id: 2,
      name: "vino",
      image: "",
    },
    {
      id: 3,
      name: "vino",
      image: "",
    },
  ];
  return (
    <Stack mt={1} spacing={1.5}>
      {data.map((user) => (
        <Box
          key={user.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <Avatar src={user.image} sx={{ mr: 1 }} />
            <Typography variant="body2" color={grey[50]}>
              {user.name}
            </Typography>
          </Box>
          <Button color="secondary" variant="contained">
            Add
          </Button>
        </Box>
      ))}
    </Stack>
  );
};

export default SearchedUserList;
