// frontend/src/components/ApiClientProvider.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface ApiClientContextType {
  getAuthToken: () => string | null;
  request: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
  register: (userData: { email: string; username: string; password: string }) => Promise<any>;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<any>;
  getUserTasks: (userId: string) => Promise<any>;
  createTask: (userId: string, taskData: { title: string; description?: string; due_date?: string }) => Promise<any>;
  getTask: (userId: string, taskId: string) => Promise<any>;
  updateTask: (userId: string, taskId: string, taskData: { title?: string; description?: string; completed?: boolean; due_date?: string }) => Promise<any>;
  toggleTaskCompletion: (userId: string, taskId: string, completed: boolean) => Promise<any>;
  deleteTask: (userId: string, taskId: string) => Promise<any>;
}

const ApiClientContext = createContext<ApiClientContextType | undefined>(undefined);

export const ApiClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const request = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${baseUrl}${endpoint}`;

    // Get auth token if available
    const authToken = getAuthToken();

    console.log('API Request:', url, 'Token:', authToken ? 'Present' : 'Missing');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // For DELETE requests, there might not be a response body
    if (response.status === 204 || endpoint.includes('/logout')) {
      return {} as T;
    }

    return await response.json();
  };

  const register = async (userData: { email: string; username: string; password: string }) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };

  const login = async (credentials: { email: string; password: string }) => {
    const url = `${baseUrl}/auth/login`;
    const authToken = getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Create form data properly for OAuth2 password flow
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const logout = async () => {
    return request('/auth/logout', {
      method: 'POST',
    });
  };

  const getUserTasks = async (userId: string) => {
    return request(`/users/${userId}/tasks`);
  };

  const createTask = async (userId: string, taskData: { title: string; description?: string; due_date?: string }) => {
    return request(`/users/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  };

  const getTask = async (userId: string, taskId: string) => {
    return request(`/users/${userId}/tasks/${taskId}`);
  };

  const updateTask = async (userId: string, taskId: string, taskData: { title?: string; description?: string; completed?: boolean; due_date?: string }) => {
    return request(`/users/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  };

  const toggleTaskCompletion = async (userId: string, taskId: string, completed: boolean) => {
    return request(`/users/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  };

  const deleteTask = async (userId: string, taskId: string) => {
    return request(`/users/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  };

  const value = {
    getAuthToken,
    request,
    register,
    login,
    logout,
    getUserTasks,
    createTask,
    getTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
  };

  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (context === undefined) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return context;
};
