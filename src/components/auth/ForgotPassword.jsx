import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { FormWrapper } from '../common/FormWrapper';
import { FormError } from '../common/FormError';
import { authService } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerMessage(null);

    try {
      await authService.forgotPassword(data);
      setIsSuccess(true);
      setServerMessage("If an account with that email exists, a password reset link has been sent.");
    } catch (err) {
      setServerMessage(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" color="success.main" gutterBottom>
          Check Your Email
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {serverMessage}
        </Typography>
        <button
          onClick={() => navigate('/auth')}
          style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
          Back to Login
        </button>
      </Box>
    );
  }

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
      </Box>

      <Input
        label="Email Address"
        id="email"
        icon={Mail}
        error={errors.email?.message}
        {...register('email')}
      />

      <Button type="submit" loading={isLoading}>
        Send Reset Link <ArrowRight size={18} />
      </Button>

      <FormError message={serverMessage} />

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