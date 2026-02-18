// frontend/src/lib/api-client.ts
/**
 * API client implementation for all backend communications
 */

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Generic request method
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get auth token if available
    const authToken = this.getAuthToken();

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

    return response.json();
  }

  /**
   * Helper method to get the current user's token
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Authentication methods
   */
  async register(userData: { email: string; username: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: credentials.email,
        password: credentials.password,
      }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  /**
   * Task methods
   */
  async getUserTasks(userId: string) {
    return this.request(`/users/${userId}/tasks`);
  }

  async createTask(userId: string, taskData: { title: string; description?: string }) {
    return this.request(`/users/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTask(userId: string, taskId: string) {
    return this.request(`/users/${userId}/tasks/${taskId}`);
  }

  async updateTask(userId: string, taskId: string, taskData: Partial<{ title: string; description?: string; completed: boolean }>) {
    return this.request(`/users/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async toggleTaskCompletion(userId: string, taskId: string, completed: boolean) {
    return this.request(`/users/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  }

  async deleteTask(userId: string, taskId: string) {
    return this.request(`/users/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
