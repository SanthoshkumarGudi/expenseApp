import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/v1',
  withCredentials: true, // Important for httpOnly cookies
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // You can attach token from context if needed (for now backend uses cookies)
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // TODO: Later implement token refresh
        // For now, just logout
        window.location.href = '/auth';
        return Promise.reject(error);
      } catch (refreshError) {
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data) => {
    const res = await api.post('/auth/login', data);
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
};

export default api;