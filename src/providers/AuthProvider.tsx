// frontend/src/providers/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSession, setSession, clearSession, decodeJWT } from '../lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '../lib/config';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check session on mount
  useEffect(() => {
    const session = getSession();
    setUser(session.user);
    setToken(session.token);
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      const userInfo = decodeJWT(data.access_token);
      
      console.log('Login successful, user info:', userInfo);

      setSession(data.access_token, userInfo);
      setToken(data.access_token);
      setUser(userInfo);

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { email: string; username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
        throw new Error(error.detail || 'Registration failed');
      }

      const user = await response.json();
      
      // After registration, automatically log in
      await login({ email: userData.email, password: userData.password });
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      clearSession();
      setUser(null);
      setToken(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Protect routes that require authentication
  useEffect(() => {
    const publicRoutes = ['/', '/auth/login', '/auth/register'];
    if (!publicRoutes.includes(pathname) && !isAuthenticated() && !loading) {
      router.push('/auth/login');
    }
  }, [pathname, user, token, loading, router]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
