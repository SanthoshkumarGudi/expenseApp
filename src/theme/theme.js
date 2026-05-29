
import { createTheme } from "@mui/material/styles";
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f766e",
      dark: "#0d6b64",
    },
    secondary: {
      main: "#5eead4",
    },
    background: {
      default: "#f0fdfa",
      paper: "#ffffff",
    },
    text: {
      primary: "#042f2e",
      secondary: "#0d9488",
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Arial", sans-serif`,
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "0px 2px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "medium",
      },
    },
  },
});
