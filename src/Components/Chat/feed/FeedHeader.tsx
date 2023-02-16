import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";

interface Props {}

const FeedHeader: React.FC<Props> = () => {
  const theme = useTheme();
  const router = useRouter();

  const { conversationId } = router.query;

  const back = () => router.push("/");

  if (!conversationId) return <></>;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        bgcolor: "grey.800",
        p: 1,
      }}
    >
      <Box
        sx={{
          display: "none",
          [theme.breakpoints.down("sm")]: {
            display: "flex",
          },
        }}
      >
        <Button variant="contained" onClick={back}>
          Back
        </Button>
      </Box>
      <Box display="flex" ml={1} color="grey.200">
        <Typography variant="h6">To :</Typography>
        <Typography ml={1} variant="h6">
          {conversationId}
        </Typography>
      </Box>
    </Box>
  );
};

export default FeedHeader;
