// ==================== src/components/auth/Login.jsx ====================
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { loginSchema } from "../../lib/validation";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { FormWrapper } from "../common/FormWrapper";
import { FormError } from "../common/FormError";
import { authService } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Link, Divider, IconButton } from "@mui/material";
import { Stack } from "@mui/system";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data) => {
    // ... existing logic unchanged
    setIsLoading(true);
    setServerError(null);

    try {
      const loginPayload = {
        username: data.email,
        password: data.password,
      };

      const response = await authService.login(loginPayload);

      if (response.requires_2fa) {
        navigate("/login/2fa", {
          state: { userId: response.user_id },
          replace: true,
        });
        return;
      }

      if (response.access_token) {
        login(response.access_token, response.refresh_token);
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data);
      let errorMsg = "Invalid credentials";
      if (err.response?.data?.detail) {
        errorMsg = typeof err.response.data.detail === "string" 
          ? err.response.data.detail 
          : err.response.data.detail[0]?.msg || "Validation error";
      }
      setServerError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="body1" color="text.secondary">
          Sign in to access your workspace
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Input
          label="Email Address"
          id="email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
          fullWidth
        />

        <Box sx={{ position: 'relative' }}>
          <Input
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            error={errors.password?.message}
            {...register("password")}
            fullWidth
          />
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            sx={{ position: 'absolute', right: 12, top: 38 }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" {...register("rememberMe")} />
            <Typography variant="body2">Remember me</Typography>
          </label>
          <Link href="/forgot-password" underline="hover" sx={{ fontSize: '0.875rem' }}>
            Forgot password?
          </Link>
        </Box>

        <Button type="submit" loading={isLoading} fullWidth size="large">
          Sign in <ArrowRight size={18} style={{ marginLeft: 8 }} />
        </Button>

        <FormError message={serverError} />

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">or</Typography>
        </Divider>

        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={() => authService.googleLogin()}
          sx={{ py: 1.5 }}
        >
          Continue with Google
        </Button>
      </Stack>
    </FormWrapper>
  );
};