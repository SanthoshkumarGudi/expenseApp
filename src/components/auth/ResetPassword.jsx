import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { FormWrapper } from '../common/FormWrapper';
import { FormError } from '../common/FormError';
import { authService } from '../../lib/api';
import { Box, Typography } from '@mui/material';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      setServerError("Invalid or expired reset link");
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      await authService.resetPassword({ token, password: data.password });
      setIsSuccess(true);
      setTimeout(() => navigate('/auth'), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" color="success.main" gutterBottom>
          Password Reset Successful
        </Typography>
        <Typography variant="body1">
          You can now sign in with your new password.
        </Typography>
      </Box>
    );
  }

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Set New Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please enter your new password
        </Typography>
      </Box>

      <Input
        label="New Password"
        id="password"
        type="password"
        icon={Lock}
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm New Password"
        id="confirmPassword"
        type="password"
        icon={Lock}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" loading={isLoading}>
        Reset Password <ArrowRight size={18} />
      </Button>

      <FormError message={serverError} />

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <button
          onClick={() => navigate('/auth')}
          style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
          Back to Login
        </button>
      </Box>
    </FormWrapper>
  );
};