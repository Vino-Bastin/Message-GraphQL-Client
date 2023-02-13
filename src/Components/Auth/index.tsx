/**
 * @file Auth Component
 * @description Auth Component - Login with Google
 * @author vinobastin
 */

import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import { grey } from "@mui/material/colors";
import { signIn } from "next-auth/react";
import { useTheme } from "@mui/material";

const Auth: React.FC = () => {
  const theme = useTheme();

  return (
    // This is the main container
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      {/* This is the container for the content */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        bgcolor={grey[600]}
        borderRadius="10px"
        padding="2rem"
        sx={{
          [theme.breakpoints.down("sm")]: {
            width: "100%",
            height: "100%",
          },
          [theme.breakpoints.between("sm", "md")]: {
            width: "50%",
            height: "50%",
          },
          [theme.breakpoints.up("md")]: {
            width: "40%",
            height: "40%",
          },
        }}
      >
        {/* app name */}
        <Typography
          variant="h4"
          textAlign="center"
          color={grey[300]}
          sx={{ mb: 2 }}
        >
          Message
        </Typography>

        {/* login with google button */}
        <Button variant="contained" onClick={() => signIn("google")}>
          <GoogleIcon sx={{ mr: 1, color: grey[200] }} />
          <Typography variant="button" color={grey[200]}>
            Continue With Google
          </Typography>
        </Button>

        {/* note */}
        <Typography
          variant="body2"
          textAlign="center"
          fontSize="8pt"
          sx={{ mt: 2 }}
          color={grey[400]}
        >
          Note : Your profile picture & name will be used from your Google
          account
        </Typography>
      </Box>
    </Box>
  );
};

export default Auth;
