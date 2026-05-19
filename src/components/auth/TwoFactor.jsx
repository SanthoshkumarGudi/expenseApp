import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { FormError } from '../common/FormError';
import { Box, Typography } from '@mui/material';
import { authService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export const TwoFactor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  //user from the auth context
 

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputsRef = useRef([]);
  const userId = location.state?.userId;

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
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
    <Box sx={{ maxWidth: 420, mx: 'auto', px: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Two-Factor Authentication
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the 6-digit code from your authenticator app
        </Typography>
      </Box>

      <form onSubmit={onSubmit}>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1.5, 
            justifyContent: 'center', 
            mb: 4 
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
                width: 55,
                height: 65,
                fontSize: 28,
                textAlign: 'center',
                border: '2px solid #1976d2',
                borderRadius: 10,
                outline: 'none',
                backgroundColor: '#fff',
              }}
            />
          ))}
        </Box>

        <Button type="submit" loading={isLoading} fullWidth>
          Verify Code
        </Button>
      </form>

      <FormError message={serverError} />

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <button
          onClick={() => navigate('/auth')}
          style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95rem' }}
        >
          ← Back to Login
        </button>
      </Box>
    </Box>
  );
};