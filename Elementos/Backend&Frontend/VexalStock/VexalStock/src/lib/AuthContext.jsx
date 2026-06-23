import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authClient from '@/api/authClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const isLoadingPublicSettings = false;

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      const currentUser = await authClient.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await authClient.login(email, password);
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
      return currentUser;
    } catch (error) {
      setAuthError({ type: 'login', message: error.message });
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginWithProvider = async (provider) => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await authClient.loginWithProvider(provider);
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
      return currentUser;
    } catch (error) {
      setAuthError({ type: 'login', message: error.message });
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const register = async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const result = await authClient.register(email, password);
      setAuthError(null);

      if (result?.autoVerified) {
        const currentUser = await authClient.me();
        setUser(currentUser);
        setIsAuthenticated(true);
      }

      return result;
    } catch (error) {
      setAuthError({ type: 'register', message: error.message });
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const verifyOtp = async ({ email, otpCode }) => {
    setIsLoadingAuth(true);
    try {
      const result = await authClient.verifyOtp({ email, otpCode });
      const currentUser = await authClient.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
      return result;
    } catch (error) {
      setAuthError({ type: 'verifyOtp', message: error.message });
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const resendOtp = async (email) => {
    return authClient.resendOtp(email);
  };

  const resetPasswordRequest = async (email) => {
    return authClient.resetPasswordRequest(email);
  };

  const resetPassword = async ({ resetToken, newPassword }) => {
    return authClient.resetPassword({ resetToken, newPassword });
  };

  const logout = () => {
    authClient.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      login,
      loginWithProvider,
      register,
      verifyOtp,
      resendOtp,
      resetPasswordRequest,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
