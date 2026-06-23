import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { AuthLayout } from "../components/auth/AuthLayout";
import { VerifyEmail } from "../components/auth/VerifyEmail";
import { ForgotPassword } from "../components/auth/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";
import { SecuritySettings } from "../components/auth/SecuritySettings";
import { Profile } from "../components/profile/Profile";
import { Sessions } from "../components/profile/Sessions";
import { RouterProvider } from "react-router-dom";
import { AdminUsers } from "../components/admin/AdminUsers";
import { AdminRoute } from "../components/common/AdminRoute";
import { AuditLogs } from "../components/admin/AuditLogs";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { OAuthSuccess } from "../pages/OAuthSuccess";
import TravelList from "../pages/travel/TravelList";
import TravelDetails from "../pages/travel/TravelDetails";
import TravelCreate from "../pages/travel/TravelCreate";
import TravelEdit from "../pages/travel/TravelEdit";
import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeDetail from "../pages/employees/EmployeeDetail";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeCreate from "../pages/employees/EmployeeCreate";
import EmployeeEdit from "../pages/employees/EmployeeEdit";

const Dashboard = () => (
  <Box style={{ padding: 40, textAlign: "center", fontSize: 24 }}>
    <Typography
      
      sx={{
        fontSize: {
          xs: "3rem",
          sm: "5rem",
          md: "6rem",
        },
      }}
    >
      Dashboard
    </Typography>
    Welcome to Expense Management System Dashboard!
    <p>This page is in development.</p>
  </Box>
);

const NotFound = () => (
  <Box style={{ padding: 40, textAlign: "center", fontSize: 20 }}>
    404 - Page Not Found
  </Box>
);

// Layout Component
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // ====================== PUBLIC ROUTES (as per docs) ======================
      {
        path: "/login",
        element: <AuthLayout />,
      },
      {
        path: "/register",
        element: <AuthLayout />,
      },
      {
        path: "/login/2fa",
        element: <AuthLayout />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/oauth-success",
        element: <OAuthSuccess />,
      },

      // ===================== PROTECTED ROUTES (for authentication) =========================
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

      // =======ADMIN ONLY ROUTES========
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
      {
        path: "reset-password",
        element: <ResetPassword />,
      },

      //travel routes
      {
        path: "/travel/list",
        element: <TravelList />,
      },
      {
        path: "/travel/add",
        element: <TravelCreate />,
      },
      {
        path: "/travel/:id",
        element: <TravelDetails />,
      },
      {
        path: "/travel/edit/:id",
        element: <TravelEdit />,
      },

      //emloyee master routes
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

      // Catch-all
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
