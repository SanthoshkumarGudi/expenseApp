import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { AuthCard } from '../common/AuthCard';
import { Login } from './Login';
import { Register } from './Register';
import { TwoFactor } from './TwoFactor';
import { useFormTransition } from '../../hooks/useFormTransition';

export const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transitionClass, handleSwitch } = useFormTransition();

  const is2faRoute = location.pathname === '/login/2fa';
  const isRegisterRoute = location.pathname === '/register';

  const [mode, setMode] = useState(is2faRoute ? '2fa' : isRegisterRoute ? 'register' : 'login');

  // Sync mode with URL
  useEffect(() => {
    if (is2faRoute) setMode('2fa');
    else if (isRegisterRoute) setMode('register');
    else setMode('login');
  }, [is2faRoute, isRegisterRoute]);

  const toggleForm = () => {
    handleSwitch();

    if (mode === 'login') {
      navigate('/register', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
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

        {/* Toggle only for login/register */}
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