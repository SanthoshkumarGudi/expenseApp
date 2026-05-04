import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { registerSchema } from "../../lib/validation";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { FormWrapper } from "../common/FormWrapper";
import { FormError } from "../common/FormError";
import { authService } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await authService.register(data);

      // Backend should return the verification token
      const verificationToken = response.verification_token || response.token;

      if (verificationToken) {
        navigate(`/verify-email/${verificationToken}`);
      } else {
        // Fallback message if backend doesn't return token yet
        setServerError(
          "Registration successful! Please check your email for verification link.",
        );
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sign up to access your organization workspace
        </Typography>
      </Box>

      <Input
        label="Full Name"
        id="fullName"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        label="Email Address"
        id="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" loading={isLoading}>
        Create account <ArrowRight size={18} />
      </Button>

      <FormError message={serverError} />

      <p
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#666",
          marginTop: 16,
        }}
      >
        By signing up you agree to our{" "}
        <a href="#" style={{ color: "#1976d2" }}>
          Terms
        </a>
      </p>
    </FormWrapper>
  );
};
