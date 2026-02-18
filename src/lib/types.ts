// frontend/src/lib/types.ts

export interface User {
  id: number;
  email: string;
  username: string;
  created_at?: string;
  is_active?: boolean;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  due_date?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  completed?: boolean;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  due_date?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
