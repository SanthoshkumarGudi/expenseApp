import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { loginSchema } from '../../lib/validation';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { FormWrapper } from '../common/FormWrapper';
import { FormError } from '../common/FormError';
import { authService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

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
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await authService.login(data);

      // === 2FA Flow as per Documentation ===
      if (response.status === '2fa_required' || response.session_token) {
        navigate('/auth/2fa', {
          state: {
            sessionToken: response.session_token,
            methods: response.methods || ['totp']
          },
          replace: true
        });
        return;
      }

      // Normal login - No 2FA required
      if (response.access_token) {
        login(response.access_token);
        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Enterprise Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sign in to access your organization workspace
        </Typography>
      </Box>

      <Input 
        label="Email Address" 
        id="email" 
        icon={Mail} 
        error={errors.email?.message} 
        {...register('email')} 
      />
      
      <div style={{ position: 'relative' }}>
        <Input
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ 
            position: 'absolute', 
            right: 12, 
            top: 42, 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" {...register('rememberMe')} />
          Remember me
        </label>
        <a href="/forgot-password" style={{ color: '#1976d2' }}>Forgot password?</a>
      </div>

      <Button type="submit" loading={isLoading}>
        Sign in <ArrowRight size={18} />
      </Button>

      <FormError message={serverError} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16, flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ color: '#666', margin: '8px 0' }}>Or sign in with</p>
        <Button 
          type="button" 
          variant="outlined" 
          onClick={() => authService.googleLogin()}
        >
          Google
        </Button>
      </div>
    </FormWrapper>
  );
};