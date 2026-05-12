import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { AuthLayout } from "../components/auth/AuthLayout";
import { VerifyEmail } from "../components/auth/VerifyEmail";
import { ForgotPassword } from "../components/auth/ForgotPassword";
import { ResetPassword } from "../components/auth/ResetPassword";
import { SecuritySettings } from "../components/auth/SecuritySettings";
import { Profile } from "../components/profile/Profile";
import { Sessions } from "../components/profile/Sessions";
import { RouterProvider } from "react-router-dom";
import { AdminUsers } from "../components/admin/AdminUsers";
import { AdminRoute } from "../components/common/AdminRoute";
import { AuditLogs } from "../components/admin/AuditLogs";

const Dashboard = () => (
  <div style={{ padding: 40, textAlign: "center", fontSize: 24 }}>
    ✅ Welcome to Enterprise Dashboard
  </div>
);

const NotFound = () => (
  <div style={{ padding: 40, textAlign: "center", fontSize: 20 }}>
    404 - Page Not Found
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // ====================== PUBLIC ROUTES (as per docs) ======================
  {
    path: "/login",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
  },
  {
    path: "/login/2fa",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthProvider>
        <ForgotPassword />
      </AuthProvider>
    ),
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email/:token",
    element: <VerifyEmail />,
  },

  // ====================== PROTECTED ROUTES ======================
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/settings/security",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <SecuritySettings />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/settings/sessions",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Sessions />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },

  // =======ADMIN ONLY ROUTE
  {
    path: "/admin/users",
    element: (
      <AuthProvider>
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      </AuthProvider>
    ),
  },

  {
    path: "/admin/audit-logs",
    element: (
      <AuthProvider>
        <AdminRoute>
          <AuditLogs />
        </AdminRoute>
      </AuthProvider>
    ),
  },

  // Catch-all
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
