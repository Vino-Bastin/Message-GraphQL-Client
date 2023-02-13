import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { grey, blue } from "@mui/material/colors";

interface ThemeProps {
  children: React.ReactNode;
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: grey[800],
    },
    secondary: {
      main: blue[800],
    },
    background: {
      default: grey[700],
    },
  },
  typography: {
    fontFamily: "Source Sans Pro, sans-serif",
    button: {
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
};

const Theme: React.FC<ThemeProps> = ({ children }) => {
  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
