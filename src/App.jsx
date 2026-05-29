import { AppRouter } from "./routes/router";
import { Box } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <AppRouter />
      </Box>
    </AuthProvider>
  );
}

export default App;