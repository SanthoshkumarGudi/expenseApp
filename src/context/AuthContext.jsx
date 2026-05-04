import { createContext, useState, useEffect } from 'react';
import { authService } from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token) => {
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
    setAccessToken(null);
    window.location.href = '/auth';
  };

  const logoutAll = async () => {
    try {
      await authService.logoutAll();
    } catch (e) {
      console.error(e);
    }
    setAccessToken(null);
    window.location.href = '/auth';
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  console.log("AuthContext - isAuthenticated:", !!accessToken);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!accessToken,
      accessToken,
      login,
      logout,
      logoutAll,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};