import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../lib/api";
import {Box, Typography} from "@mui/material"; 
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

 const token = new URLSearchParams(window.location.search).get("token");

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("RESET TOKEN:", token);

  try {
    const res = await authService.resetPassword(
      token,
      newPassword,
      confirmPassword
    );

    setMessage(res.message || "Password reset successful");
  } catch (err) {
    console.log(err.response?.data);
    setMessage(err.response?.data?.detail || "Password reset failed");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Reset Password</Typography>

      <Input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        label="New Password"
        required
      />

      <Input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirm Password"
        required
      />

      <Button type="submit">Reset Password</Button>

      {message && <p>{message}</p>}
    </form>
  );
};