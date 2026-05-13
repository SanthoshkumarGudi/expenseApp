import { createContext, useState, useEffect } from "react";
import { authService } from "../lib/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
    setUser(null);
    window.location.href = "/auth";
  };

  const loadUserProfile = async () => {
    if (!accessToken) return;
    
    try {
      console.log("inside load user profile");
      const userData = await authService.getCurrentUser();
      console.log("user data is ", userData);
      setUser(userData);
    } catch (err) {
      console.error("Failed to load user profile", err);
      if (err.response?.status === 401) {
        logout();
      }
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