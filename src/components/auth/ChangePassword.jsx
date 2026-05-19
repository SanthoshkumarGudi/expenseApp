import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { FormWrapper } from '../common/FormWrapper';
import { FormError } from '../common/FormError';
import { authService } from '../../lib/api';
import { Box, Typography } from '@mui/material';

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
});

export const ChangePassword = () => {
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await authService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });

      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      {/* <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Change Password</Typography>
      </Box> */}

      <Input label="Current Password" type="password" icon={Lock} {...register('currentPassword')} error={errors.currentPassword?.message} />
      <Input label="New Password" type="password" icon={Lock} {...register('newPassword')} error={errors.newPassword?.message} />
      <Input label="Confirm New Password" type="password" icon={Lock} {...register('confirmNewPassword')} error={errors.confirmNewPassword?.message} />

      <Button type="submit" loading={isLoading}>Update Password <ArrowRight size={18} /></Button>

      <FormError message={serverError} />
      {success && <p style={{ color: 'green', textAlign: 'center', marginTop: 12 }}>✅ Password changed successfully!</p>}
    </FormWrapper>
  );
};