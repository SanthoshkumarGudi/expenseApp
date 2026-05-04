import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { AuthLayout } from '../components/auth/AuthLayout';
import { VerifyEmail } from '../components/auth/VerifyEmail';
import { ForgotPassword } from '../components/auth/ForgotPassword';
import { ResetPassword } from '../components/auth/ResetPassword';
import { RouterProvider } from 'react-router-dom';

const Dashboard = () => (
  <div style={{ padding: 40, fontSize: 28, textAlign: 'center' }}>
    ✅ Welcome to Dashboard <br />
    <small style={{ fontSize: 18, color: '#666', marginTop: 20, display: 'block' }}>
      Core Authentication Flow Completed
    </small>
  </div>
);

const NotFound = () => (
  <div style={{ padding: 40, textAlign: 'center', fontSize: 20 }}>
    404 - Page Not Found
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth" replace />,
  },

  // Public Authentication Routes
  {
    path: '/auth',
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
  },
  {
    path: '/auth/2fa',
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthProvider>
        <ForgotPassword />
      </AuthProvider>
    ),
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    path: '/verify-email/:token',
    element: <VerifyEmail />,
  },

  // Protected Routes
  {
    path: '/dashboard',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },

  // Catch-all Route
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;