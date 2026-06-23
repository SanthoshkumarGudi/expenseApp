import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { FormWrapper } from "../common/FormWrapper";
import { authService } from "../../lib/api";
import { Alert, Box, LinearProgress, Typography } from "@mui/material";
import { LockOutlined, ArrowForward, CheckCircleOutlineOutlined} from "@mui/icons-material";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

const getStrength = (val) => {
  if (!val) return null;
  let score = 0;
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { value: 20, label: "Very weak",   color: "error"   },
    { value: 40, label: "Weak",        color: "warning" },
    { value: 60, label: "Fair",        color: "warning" },
    { value: 80, label: "Strong",      color: "success" },
    { value: 100, label: "Very strong", color: "success" },
  ];
  return levels[Math.min(score - 1, 4)];
};

export const ChangePassword = () => {
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const newPasswordVal = watch("newPassword", "");
  const strength = getStrength(newPasswordVal);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await authService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmNewPassword,
      });
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Current password"
        type="password"
        icon={LockOutlined}
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Input
          label="New password"
          type="password"
          icon={LockOutlined}
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />
        {strength && (
          <>
            <LinearProgress
              variant="determinate"
              value={strength.value}
              color={strength.color}
              sx={{ height: 3, borderRadius: 99, mt: 0.5 }}
            />
            <Typography
              variant="caption"
              color={`${strength.color}.main`}
              sx={{ fontWeight: 500 }}
            >
              {strength.label}
            </Typography>
          </>
        )}
      </Box>

      <Input
        label="Confirm new password"
        type="password"
        icon={LockOutlined}
        {...register("confirmNewPassword")}
        error={errors.confirmNewPassword?.message}
      />

      {serverError && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {serverError}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          icon={<CheckCircleOutlineOutlined/>}
          sx={{ borderRadius: 3 }}
        >
          Password changed successfully
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pt: 2,
          mt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          loading={isLoading}
          endIcon={<ArrowForward />}
          sx={{ px: 3, py: 1 }}
        >
          Update password
        </Button>
      </Box>
    </FormWrapper>
  );
};