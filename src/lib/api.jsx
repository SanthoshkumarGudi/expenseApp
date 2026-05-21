import axios from "axios";
import { Navigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // CALL REFRESH ENDPOINT
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/token/refresh",
          {
            refresh_token: refreshToken,
          },
        );

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        // SAVE NEW TOKENS
        localStorage.setItem("access_token", newAccessToken);

        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // UPDATE FAILED REQUEST
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // RETRY ORIGINAL REQUEST
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed");

        // CLEAR STORAGE
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // REDIRECT LOGIN
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        Navigate("/login");
      }
    }

    return Promise.reject(error);
  },
);

export const authService = {
  login: async ({ username, password }) => {
    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const res = await api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  },

  verify2fa: async (data) => {
    const res = await api.post("/auth/login/2fa", data);
    return res.data;
  },

  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  verifyEmail: async (token) => {
    const res = await api.get(`/auth/email/verify/${token}`);
    return res.data;
  },
  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8000/v1"}/auth/google`;
  },
  forgotPassword: async (data) => {
    const res = await api.post("/auth/password/reset-request", data);
    return res.data;
  },

  resetPassword: async ({ token, password }) => {
    const res = await api.post("/auth/password/reset", { token, password });
    return res.data;
  },
  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    const res = await api.post("/auth/logout", {
      refresh_token: refreshToken,
    });

    return res.data;
  },

  //logout from all devices for that user
  logoutAll: async () => {
    const res = await api.post("/auth/logout/all");
    return res.data;
  },

  // Change Password (for logged-in users)
  changePassword: async (data) => {
    const res = await api.post("/auth/password/change", data);
    return res.data;
  },

  // 2FA Management
  setup2fa: async () => {
    const res = await api.post("/auth/2fa/setup");
    return res.data;
  },

  verify2faSetup: async (code) => {
    const res = await api.post("/auth/2fa/verify-setup", { code });
    return res.data;
  },

  disable2fa: async (code) => {
    const res = await api.delete("/auth/2fa/disable", { data: { code } });
    return res.data;
  },
  // === User Profile Endpoints ===

  updateProfile: async (data) => {
    const res = await api.patch("/users/me", data); // ← Do NOT use FormData here
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },

  // === NEW: Admin 
  // === ADMIN ONLY ENDPOINTS ===

  // List all users (paginated)
  getAllUsers: async (params = {}) => {
    const res = await api.get("/users", { params });
    return res.data;
  },

  // Invite new user
  inviteUser: async (data) => {
    const res = await api.post("/users/invite", data);
    return res.data;
  },

  // Update user role or status
  updateUser: async (userId, data) => {
    const res = await api.patch(`/users/${userId}`, data);
    return res.data;
  },

  // Deactivate user account
  deleteUser: async (userId) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  },

  // Get audit logs
  getAuditLogs: async (params = {}) => {
    const res = await api.get("/audit-logs", { params });
    return res.data;
  },

  // ========================= newly added endpoints =========================
  //get active sessions for current user
  getSessions: async () => {
    const res = await api.get("/users/me/sessions");
    return res.data;
  },

  //delete specific session
  terminateSession: async (sessionId) => {
    const res = await api.delete(`/users/me/sessions/${sessionId}`);
    return res.data;
  },


  adminUsers: async (page = 1, limit = 10) => {
    const res = await api.get(`/users?page=${page}&limit=${limit}`);
    return res.data;
  },

  inviteUser: async (data) => {
    const res = await api.post("/users/invite", data);
    return res.data;
  },

  updateUserRole: async (userId, data) => {
    const res = await api.patch(`/users/${userId}`, data);
    return res.data;
  },
};

export default api;
