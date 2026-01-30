import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, getApiErrorMessage } from '../api/auth';
import type { UserInfo, UserRole } from '../types';

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const tokenKey = 'token';
const refreshKey = 'refreshToken';
const userKey = 'user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(tokenKey),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const persistAuth = useCallback((token: string, refreshToken: string, user: UserInfo) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(refreshKey, refreshToken);
    localStorage.setItem(userKey, JSON.stringify(user));
    setState((s) => ({
      ...s,
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }));
  }, []);

  const loadStoredUser = useCallback(() => {
    const stored = localStorage.getItem(userKey);
    if (stored) {
      try {
        return JSON.parse(stored) as UserInfo;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    const user = loadStoredUser();
    if (token && user) {
      setState((s) => ({ ...s, user, isAuthenticated: true, isLoading: false }));
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, [loadStoredUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const res = await authApi.login({ email, password });
        persistAuth(res.token, res.refreshToken, res.user);
      } catch (err) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: getApiErrorMessage(err),
        }));
        throw err;
      }
    },
    [persistAuth]
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string, role?: UserRole) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const res = await authApi.signup({ email, password, name, role });
        persistAuth(res.token, res.refreshToken, res.user);
      } catch (err) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: getApiErrorMessage(err),
        }));
        throw err;
      }
    },
    [persistAuth]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!state.user) return false;
      return roles.includes(state.user.role);
    },
    [state.user]
  );

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
