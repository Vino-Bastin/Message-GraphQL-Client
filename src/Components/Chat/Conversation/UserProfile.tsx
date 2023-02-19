import { Box, Avatar, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

const UserProfile: React.FC = () => {
  const { data } = useSession();

  return (
    <Box
      m={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Avatar
        src={data?.user?.image as string}
        sx={{
          my: 1,
          width: "70px",
          height: "70px",
        }}
      />
      <Typography variant="body1" color="grey.200">
        {data?.user?.name}
      </Typography>
    </Box>
  );
};
export default UserProfile;
