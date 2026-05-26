import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ChangePassword } from "./ChangePassword";
import { TwoFactorSettings } from "./TwoFactorSettings";

export const SecuritySettings = () => {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Security Settings
      </Typography>

      <Box sx={{ display: "flex", gap: 3, mb: 4, borderBottom: "1px solid #e0e0e0" }}>
        <button onClick={() => setActiveTab("password")}>
          Change Password
        </button>

        <button onClick={() => setActiveTab("2fa")}>
          Two Factor Auth
        </button>
      </Box>

      {activeTab === "password" && <ChangePassword />}
      {activeTab === "2fa" && <TwoFactorSettings />}
    </Box>
  );
};