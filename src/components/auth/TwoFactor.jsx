// ==================== src/components/auth/TwoFactor.jsx ====================
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { FormError } from '../common/FormError';
import { Box, Typography, Stack } from '@mui/material';
import { authService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export const TwoFactor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputsRef = useRef([]);
  const userId = location.state?.userId;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

 const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto move to next input
    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputsRef.current[5]?.focus();
    }
  };
const onSubmit = async (e) => {
  e.preventDefault();

  const otpCode = code.join('');

  if (otpCode.length !== 6) {
    setServerError('Please enter all 6 digits');
    return;
  }

  if (!userId) {
    setServerError('Session expired. Please login again.');
    return;
  }

  setIsLoading(true);
  setServerError(null);

  try {
    const response = await authService.verify2fa({
      user_id: userId,
      otp: otpCode,
    });

    console.log('2FA Success:', response);

    login(
  response.access_token,
  response.refresh_token
);
    navigate('/dashboard', { replace: true });

  } catch (err) {
    console.error('2FA Error:', err.response?.data || err.message);

    setServerError(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      'Invalid or expired 2FA code'
    );

    setCode(['', '', '', '', '', '']);
    inputsRef.current[0]?.focus();

  } finally {
    setIsLoading(false);
  }
};

  console.log("user in 2fa is ", userId);

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Stack spacing={4} alignItems="center">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Two-Factor Authentication
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter the 6-digit code from your authenticator app
          </Typography>
        </Box>

        <form onSubmit={onSubmit} style={{ width: '100%' }}>
          <Stack spacing={3}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center' 
              }}
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: 64,
                    height: 72,
                    fontSize: 32,
                    fontWeight: 600,
                    textAlign: 'center',
                    border: '2px solid #e0e0e0',
                    borderRadius: 12,
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </Box>

            <Button type="submit" loading={isLoading} fullWidth size="large">
              Verify Code
            </Button>
          </Stack>
        </form>

        <FormError message={serverError} />

        <Typography 
          component="button"
          onClick={() => navigate('/auth')}
          sx={{ 
            color: 'primary.main', 
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          ← Back to Login
        </Typography>
      </Stack>
    </Box>
  );
};