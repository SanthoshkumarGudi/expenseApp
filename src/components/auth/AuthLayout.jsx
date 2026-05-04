import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { AuthCard } from '../common/AuthCard';
import { Login } from './Login';
import { Register } from './Register';
import { TwoFactor } from './TwoFactor';
import { useFormTransition } from '../../hooks/useFormTransition';

export const AuthLayout = () => {
  const location = useLocation();
  const { transitionClass, handleSwitch } = useFormTransition();

  const is2faRoute = location.pathname === '/auth/2fa';

  // Default to 2fa if on 2fa route, else login
  const [mode, setMode] = useState(is2faRoute ? '2fa' : 'login');

  useEffect(() => {
    if (is2faRoute) {
      setMode('2fa');
    }
  }, [is2faRoute]);

  const toggleForm = () => {
    handleSwitch();
    setTimeout(() => {
      setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    }, 150);
  };

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
        <Box className={transitionClass} sx={{ overflow: 'hidden', transition: 'all 0.3s' }}>
          {mode === 'login' && <Login />}
          {mode === 'register' && <Register />}
          {mode === '2fa' && <TwoFactor />}
        </Box>

        {/* Toggle links only shown for login/register */}
        {(mode === 'login' || mode === 'register') && (
          <Box sx={{ mt: 4, textAlign: 'center', fontSize: '0.875rem' }}>
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button 
                  onClick={toggleForm} 
                  style={{ color: '#1976d2', textDecoration: 'underline' }}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={toggleForm} 
                  style={{ color: '#1976d2', textDecoration: 'underline' }}
                >
                  Sign in
                </button>
              </>
            )}
          </Box>
        )}

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 6, color: 'text.disabled' }}>
          © 2026 Enterprise Login System
        </Typography>
      </AuthCard>
    </Box>
  );
};