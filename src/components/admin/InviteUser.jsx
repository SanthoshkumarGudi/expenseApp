import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { FormWrapper } from '../common/FormWrapper';
import { FormError } from '../common/FormError';
import { authService } from '../../lib/api';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'member'], { 
    errorMap: () => ({ message: 'Please select a valid role' }) 
  }),
  full_name: z.string().min(2, 'Full name is required'),
});

export const InviteUser = () => {
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await authService.inviteUser(data);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Invite New User
      </Typography>

      <Input label="Full Name" {...register('full_name')} error={errors.full_name?.message} />
      <Input label="Email Address" {...register('email')} error={errors.email?.message} />

      <Box sx={{ mt: 2 }}>
        <label>Role</label>
        <select {...register('role')} style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
          <option value="">Select Role</option>
          <option value="member">Member</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.role.message}</p>}
      </Box>

      <Button type="submit" loading={isLoading} sx={{ mt: 3 }}>
        Send Invitation
      </Button>

      <FormError message={serverError} />

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Invitation sent successfully!
        </Alert>
      )}
    </FormWrapper>
  );
};