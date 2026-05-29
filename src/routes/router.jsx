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
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { OAuthSuccess } from "../pages/OAuthSuccess";
import  TravelList from "../pages/travel/TravelList";
import TravelDetails from "../pages/travel/TravelDetails";
import TravelCreate from "../pages/travel/TravelCreate";
import TravelEdit from "../pages/travel/TravelEdit";  



const Dashboard = () => (
  <div style={{ padding: 40, textAlign: "center", fontSize: 24 }}>
     Welcome to Expense Enterprise Dashboard
     <p>
      This page is in development.
     </p>
  </div>
);

const NotFound = () => (
  <div style={{ padding: 40, textAlign: "center", fontSize: 20 }}>
    404 - Page Not Found
  </div>
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
    element: <MainLayout   />,
    children: [
       // ====================== PUBLIC ROUTES (as per docs) ======================
  {
    path: "/login",
    element: (
      // <AuthProvider>
        <AuthLayout />
      //  </AuthProvider> 
    ),
  },
  {
    path: "/register",
    element: (
      // <AuthProvider>
        <AuthLayout />
      // </AuthProvider>
    ),
  },
  {
    path: "/login/2fa",
    element: (
      // <AuthProvider>
        <AuthLayout />
      // </AuthProvider>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      // <AuthProvider>
        <ForgotPassword />
      // </AuthProvider>
    ),
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
  path:"/oauth-success",
  element:<OAuthSuccess /> 
},

  // ====================== PROTECTED ROUTES ======================
  {
    path: "/dashboard",
    element: (
      // <AuthProvider>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      // </AuthProvider>
    ),
  },
  {
    path: "/profile",
    element: (
      // <AuthProvider>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      // </AuthProvider>
    ),
  },
  {
    path: "/settings/security",
    element: (
      // <AuthProvider>
        <ProtectedRoute>
          <SecuritySettings />
        </ProtectedRoute>
      // </AuthProvider>
    ),
  },
  {
    path: "/settings/sessions",
    element: (
      // <AuthProvider>
        <ProtectedRoute>
          <Sessions />
        </ProtectedRoute>
      // </AuthProvider>
    ),
  },

  // =======ADMIN ONLY ROUTE
  {
    path: "/admin/users",
    element: (
      // <AuthProvider>
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      // </AuthProvider>
    ),
  },

  {
    path: "/admin/audit-logs",
    element: (
      // <AuthProvider>
        <AdminRoute>
          <AuditLogs />
        </AdminRoute>
      // </AuthProvider>
    ),
  },
   {
  path: "reset-password",
  element: <ResetPassword />,
},

//travel routes
{
  path: "/travel/list",
  element: <TravelList />
},
{
  path:"/travel/add",
  element: <TravelCreate />
},
{
  path:"/travel/:id",
  element: <TravelDetails />
},
{
  path:"/travel/edit/:id",
  element: <TravelEdit />

},

  // Catch-all
  {
    path: "*",
    element: <NotFound />,
  },

    ]
  },

 ]);

export const AppRouter = () => <RouterProvider router={router} />;
