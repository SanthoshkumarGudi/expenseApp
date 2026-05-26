import { useState } from "react";
import { Box, Typography, TextField, Stack } from "@mui/material";
import { authService } from "../../lib/api";
import { Button } from "../common/Button";

export const TwoFactorSettings = () => {
  const [setupData, setSetupData] = useState(null);
  const [code, setCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSetup = async () => {
    setMessage("");
    const res = await authService.setup2fa();
    setSetupData(res);
  };

  const handleVerifySetup = async () => {
    setMessage("");
    const res = await authService.verify2faSetup(code);
    setMessage(res.message || "2FA enabled successfully");
  };

  const handleDisable = async () => {
    setMessage("");
    const res = await authService.disable2fa(disableCode);
    setMessage(res.message || "2FA disabled successfully");
    setSetupData(null);
    setCode("");
    setDisableCode("");
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h6">Authenticator App 2FA</Typography>

        <Button type="button" onClick={handleSetup}>
          Setup 2FA
        </Button>

        {setupData && (
          <>
            <Typography>Scan this QR code in Google Authenticator:</Typography>

            <img
              src={`data:image/png;base64,${setupData.qr_code_base64}`}
              alt="2FA QR Code"
              style={{ width: 220, height: 220 }}
            />

            <Typography>
              Secret: {setupData.secret}
            </Typography>

            <TextField
              label="Enter 6 digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Button type="button" onClick={handleVerifySetup}>
              Verify & Enable 2FA
            </Button>
          </>
        )}

        <Typography variant="h6">Disable 2FA</Typography>

        <TextField
          label="Enter authenticator code"
          value={disableCode}
          onChange={(e) => setDisableCode(e.target.value)}
        />

        <Button type="button" onClick={handleDisable}>
          Disable 2FA
        </Button>

        {message && <Typography color="green">{message}</Typography>}
      </Stack>
    </Box>
  );
};