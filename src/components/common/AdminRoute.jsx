import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Box, Typography } from '@mui/material';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  console.log("user is ", user);

  if (isLoading) {
    return <div style={{ padding: 50, textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = ['super_admin', 'admin', 'org_admin'].includes(user?.role);

  if (!isAdmin) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h4" color="error">Access Denied</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Administrator privileges are required to access this page.
        </Typography>
      </Box>
    );
  }

  return children;
};