import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

// ─── Non-lazy imports (small, always needed) ──────────────────────────────────
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { AdminRoute } from "../components/common/AdminRoute";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

// ─── Lazy page imports ────────────────────────────────────────────────────────

// Auth
const AuthLayout = lazy(() =>
  import("../components/auth/AuthLayout").then((m) => ({
    default: m.AuthLayout,
  })),
);
const VerifyEmail = lazy(() =>
  import("../components/auth/VerifyEmail").then((m) => ({
    default: m.VerifyEmail,
  })),
);
const ForgotPassword = lazy(() =>
  import("../components/auth/ForgotPassword").then((m) => ({
    default: m.ForgotPassword,
  })),
);
const ResetPassword = lazy(() =>
  import("../pages/ResetPassword").then((m) => ({ default: m.ResetPassword })),
);
const OAuthSuccess = lazy(() =>
  import("../pages/OAuthSuccess").then((m) => ({ default: m.OAuthSuccess })),
);

// Profile & Settings
const Profile = lazy(() =>
  import("../components/profile/Profile").then((m) => ({ default: m.Profile })),
);
const Sessions = lazy(() =>
  import("../components/profile/Sessions").then((m) => ({
    default: m.Sessions,
  })),
);
const SecuritySettings = lazy(() =>
  import("../components/auth/SecuritySettings").then((m) => ({
    default: m.SecuritySettings,
  })),
);

// Admin
const AdminUsers = lazy(() =>
  import("../components/admin/AdminUsers").then((m) => ({
    default: m.AdminUsers,
  })),
);
const AuditLogs = lazy(() =>
  import("../components/admin/AuditLogs").then((m) => ({
    default: m.AuditLogs,
  })),
);

// Travel
const TravelList = lazy(() => import("../pages/travel/TravelList"));
const TravelDetails = lazy(() => import("../pages/travel/TravelDetails"));
const TravelCreate = lazy(() => import("../pages/travel/TravelCreate"));
const TravelEdit = lazy(() => import("../pages/travel/TravelEdit"));

// Employees
const EmployeeList = lazy(() => import("../pages/employees/EmployeeList"));
const EmployeeDetail = lazy(() => import("../pages/employees/EmployeeDetail"));
const EmployeeCreate = lazy(() => import("../pages/employees/EmployeeCreate"));
const EmployeeEdit = lazy(() => import("../pages/employees/EmployeeEdit"));

// ─── Inline pages (too small to split) ───────────────────────────────────────

const Dashboard = () => (
  <Box sx={{ padding: 5, textAlign: "center" }}>
    <Typography sx={{ fontSize: { xs: "3rem", sm: "5rem", md: "6rem" } }}>
      Dashboard
    </Typography>
    Welcome to Expense Management System Dashboard!
    <p>This page is in development.</p>
  </Box>
);

const NotFound = () => (
  <Box sx={{ padding: 5, textAlign: "center", fontSize: 20 }}>
    404 - Page Not Found
  </Box>
);

// ─── Page loader fallback ─────────────────────────────────────────────────────

const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress color="primary" size={32} thickness={3} />
  </Box>
);

// ─── Layout ───────────────────────────────────────────────────────────────────

const MainLayout = () => (
  <>
    <Navbar />
    <Box sx={{ flexGrow: 1 }}>
      {/* Single Suspense boundary wrapping all lazy routes */}
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Box>
    <Footer />
  </>
);

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // ── Public ──────────────────────────────────────────────────────────────
      { path: "/login", element: <AuthLayout /> },
      { path: "/register", element: <AuthLayout /> },
      { path: "/login/2fa", element: <AuthLayout /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/oauth-success", element: <OAuthSuccess /> },

      // ── Protected ────────────────────────────────────────────────────────────
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/security",
        element: (
          <ProtectedRoute>
            <SecuritySettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/sessions",
        element: (
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        ),
      },

      // ── Admin only ───────────────────────────────────────────────────────────
      {
        path: "/admin/users",
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/audit-logs",
        element: (
          <AdminRoute>
            <AuditLogs />
          </AdminRoute>
        ),
      },

      // ── Travel ───────────────────────────────────────────────────────────────
      { path: "/travel/list", element: <TravelList /> },
      { path: "/travel/add", element: <TravelCreate /> },
      { path: "/travel/:id", element: <TravelDetails /> },
      { path: "/travel/edit/:id", element: <TravelEdit /> },

      // ── Employees ─────────────────────────────────────────────────────────────
      {
        path: "/employees/list",
        element: (
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employees/add",
        element: (
          <AdminRoute>
            <EmployeeCreate />
          </AdminRoute>
        ),
      },
      {
        path: "/employees/:id",
        element: (
          <ProtectedRoute>
            <EmployeeDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employees/:id/edit",
        element: (
          <AdminRoute>
            <EmployeeEdit />
          </AdminRoute>
        ),
      },

      // ── Catch-all ─────────────────────────────────────────────────────────────
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
