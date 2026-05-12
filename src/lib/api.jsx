import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  withCredentials: true,
  timeout: 15000,
});

// Debug logging
api.interceptors.request.use((config) => {
  console.log(`📤 [REQUEST] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [RESPONSE] ${response.config.url} → Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ [ERROR] ${error.config?.url || ''}`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('grant_type', 'password');

    const res = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  },
  

   verify2fa: async (data) => {
    const res = await api.post('/auth/login/2fa', data);
    return res.data;
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  verifyEmail: async (token) => {
  const res = await api.get(`/auth/email/verify/${token}`);
  return res.data;
},
  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/v1'}/auth/google`;
  },
    forgotPassword: async (data) => {
    const res = await api.post('/auth/password/reset-request', data);
    return res.data;
  },

  resetPassword: async ({ token, password }) => {
    const res = await api.post('/auth/password/reset', { token, password });
    return res.data;
  },
    // Logout
  logout: async () => {
    await api.post('/auth/logout');
  },

  logoutAll: async () => {
    await api.post('/auth/logout/all');
  },

  // Change Password (for logged-in users)
  changePassword: async (data) => {
    const res = await api.post('/auth/password/change', data);
    return res.data;
  },

  // 2FA Management
  setup2fa: async () => {
    const res = await api.post('/auth/2fa/setup');
    return res.data;
  },

  verify2faSetup: async (code) => {
    const res = await api.post('/auth/2fa/verify-setup', { code });
    return res.data;
  },

  disable2fa: async (code) => {
    const res = await api.delete('/auth/2fa/disable', { data: { code } });
    return res.data;
  },
    // === User Profile Endpoints ===
  

  updateProfile: async (data) => {
    const res = await api.patch('/users/me', data);
    return res.data;
  },

  
getCurrentUser: async () => {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      console.warn("⚠️ /users/me not implemented yet");
      return { id: 1, email: "current@user.com", full_name: "Test User", role: "user" };
    }
    throw err;
  }
},

  // === NEW: Admin - Delete/Deactivate User ===
  // === ADMIN ONLY ENDPOINTS ===

  // List all users (paginated)
  getAllUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  // Invite new user
  inviteUser: async (data) => {
    const res = await api.post('/users/invite', data);
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
    const res = await api.get('/audit-logs', { params });
    return res.data;
  },
};

export default api;