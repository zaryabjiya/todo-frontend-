// frontend/src/lib/auth.ts
// Simple JWT-based authentication helpers

export interface Session {
  user: {
    id: number;
    email: string;
    username: string;
  } | null;
  token: string | null;
}

export const getSession = (): Session => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return { user: null, token: null };
  }

  try {
    const user = JSON.parse(userStr);
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
};

export const setSession = (token: string, user: { id: number; email: string; username: string }) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Helper to decode JWT token
export const decodeJWT = (token: string): { id: number; email: string; username: string } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const payload = JSON.parse(jsonPayload);
    return {
      id: payload.user_id || 0,
      email: payload.sub || '',
      username: payload.username || payload.sub || '',
    };
  } catch {
    return { id: 0, email: '', username: '' };
  }
};
