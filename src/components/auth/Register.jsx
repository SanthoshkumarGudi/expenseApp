// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Link, Divider, Alert } from '@mui/material';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { authService } from '../../lib/api';

export function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
      if (!/[!@#$%^&*()-+]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError(null);

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.register(payload);

      if (response) {
        navigate('/verify-email', {
          state: {
            email: formData.email,
            message: 'Registration successful! Please check your email to verify your account.',
          },
          replace: true,
        });
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      setServerError(
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1} alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          Create your account
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Join us to get started with your workspace
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {serverError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {serverError}
            </Alert>
          )}

          <Input
            label="Full Name"
            id="fullName"
            name="fullName"
            icon={User}
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="John Doe"
            fullWidth
          />

          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@company.com"
            fullWidth
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            fullWidth
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            fullWidth
          />

          <Button 
            type="submit" 
            loading={isLoading} 
            fullWidth 
            size="large"
            endIcon={<ArrowRight size={20} />}
          >
            Create account
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 4 }}>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
      </Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          By signing up, you agree to our{' '}
          <Link href="#" underline="hover" sx={{ fontWeight: 500 }}>
            Terms of Service
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}