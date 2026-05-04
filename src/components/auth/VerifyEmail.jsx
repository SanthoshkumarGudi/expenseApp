import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { AuthCard } from '../common/AuthCard';
import { authService } from '../../lib/api';

export const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmailToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified!');

        // Auto redirect to login after success
        setTimeout(() => navigate('/auth'), 2500);
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 
          'Verification link is invalid or has expired.'
        );
      }
    };

    verifyEmailToken();
  }, [token, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <AuthCard>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Verifying your email...
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Typography variant="h4" color="success.main" gutterBottom>
                ✓ Email Verified Successfully
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {message}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Redirecting to login page...
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Typography variant="h4" color="error.main" gutterBottom>
                Verification Failed
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                {message}
              </Typography>
              <button
                onClick={() => navigate('/auth')}
                style={{
                  color: '#1976d2',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ← Back to Login
              </button>
            </>
          )}
        </Box>
      </AuthCard>
    </Box>
  );
};