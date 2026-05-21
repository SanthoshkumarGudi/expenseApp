// ==================== src/components/auth/AuthLayout.jsx ====================
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
    <AuthCard>
      <Box className={transitionClass} sx={{ 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 1 
      }}>
        {mode === 'login' && <Login />}
        {mode === 'register' && <Register />}
        {mode === '2fa' && <TwoFactor />}
      </Box>

      {(mode === 'login' || mode === 'register') && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {mode === 'login' ? (
              <>Don&apos;t have an account?{' '}
                <Typography 
                  component="button" 
                  onClick={toggleForm}
                  sx={{ 
                    color: 'primary.main', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Create one
                </Typography>
              </>
            ) : (
              <>Already have an account?{' '}
                <Typography 
                  component="button" 
                  onClick={toggleForm}
                  sx={{ 
                    color: 'primary.main', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign in
                </Typography>
              </>
            )}
          </Typography>
        </Box>
      )}

      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          textAlign: 'center', 
          mt: 6, 
          color: 'text.disabled' 
        }}
      >
        © 2026 Enterprise Login System
      </Typography>
    </AuthCard>
  );
};