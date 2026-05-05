import { createContext, useState, useEffect } from 'react';
import { authService } from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token, userData = null) => {
    setAccessToken(token);
    if (userData) setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}
    setAccessToken(null);
    setUser(null);
    window.location.href = '/auth';
  };

  const loadUserProfile = async () => {
    if (!accessToken) return;
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Failed to load user profile", err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadUserProfile();
    }
    setIsLoading(false);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!accessToken,
      accessToken,
      user,
      login,
      logout,
      isLoading,
      loadUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};