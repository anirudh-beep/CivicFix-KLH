import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CurrentUser, LoginCredentials, RegisterPayload } from '../types/User';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<CurrentUser>;
  register: (payload: RegisterPayload) => Promise<CurrentUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for unauthorized events dispatched by API client
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('civicfix:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('civicfix:unauthorized', handleUnauthorized);
    };
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials): Promise<CurrentUser> => {
    setError(null);
    try {
      const response = await authApi.login(credentials);
      // Ensure we have fresh user record
      const freshUser = response.user || (await authApi.getMe());
      setUser(freshUser);
      return freshUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(message);
      throw err;
    }
  };

  const register = async (payload: RegisterPayload): Promise<CurrentUser> => {
    setError(null);
    try {
      const response = await authApi.register(payload);
      const freshUser = response.user || (await authApi.getMe());
      setUser(freshUser);
      return freshUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please check your details.';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
