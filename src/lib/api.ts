// frontend/src/lib/api.ts
/**
 * Base API client for all backend communications
 * NOTE: This is now a utility class that should be used with the ApiClientProvider context
 * Use the useApiClient hook to access these methods in components
 */

export interface ApiClientInterface {
  getAuthToken: () => Promise<string | null>;
  request: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
  register: (userData: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<any>;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<any>;
  getUserTasks: (userId: string) => Promise<any>;
  createTask: (userId: string, taskData: { title: string; description?: string; dueDate?: string; priority?: 'low' | 'medium' | 'high' }) => Promise<any>;
  getTask: (userId: string, taskId: string) => Promise<any>;
  updateTask: (userId: string, taskId: string, taskData: Partial<{ title: string; description?: string; dueDate?: string; priority?: 'low' | 'medium' | 'high'; completed: boolean }>) => Promise<any>;
  toggleTaskCompletion: (userId: string, taskId: string, completed: boolean) => Promise<any>;
  deleteTask: (userId: string, taskId: string) => Promise<any>;
}

// This is now just an interface and utility functions
// The actual implementation is in ApiClientProvider component