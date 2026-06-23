import { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { LockOutlined, SecurityOutlined } from "@mui/icons-material";
import { ChangePassword } from "./ChangePassword";
import { TwoFactorSettings } from "./TwoFactorSettings";

export const SecuritySettings = () => {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Security settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your password and authentication preferences
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{
          mb: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          "& .MuiTab-root": {
            textTransform: "none",
            minWidth: "auto",
            px: { xs: 1.5, sm: 2.5 },
            color: "text.secondary",
          },
          "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
          "& .Mui-selected": { color: "primary.main !important" },
        }}
      >
        <Tab
          icon={<LockOutlined fontSize="small" />}
          iconPosition="start"
          label="Change password"
          value="password"
        />
        <Tab
          icon={<SecurityOutlined fontSize="small" />}
          iconPosition="start"
          label="Two-factor auth"
          value="2fa"
        />
      </Tabs>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          bgcolor: "background.paper",
        }}
      >
        {activeTab === "password" && <ChangePassword />}
        {activeTab === "2fa" && <TwoFactorSettings />}
      </Box>
    </Box>
  );
};