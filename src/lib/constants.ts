// frontend/src/lib/constants.ts

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  TASKS: {
    BASE: '/users/{user_id}/tasks',
    GET_TASK: '/users/{user_id}/tasks/{task_id}',
    UPDATE_TASK: '/users/{user_id}/tasks/{task_id}',
    DELETE_TASK: '/users/{user_id}/tasks/{task_id}',
    TOGGLE_COMPLETION: '/users/{user_id}/tasks/{task_id}/complete',
  },
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  PROFILE: '/profile',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
} as const;

export const PRIORITY_LEVELS = ['low', 'medium', 'high'] as const;

export type PriorityLevel = typeof PRIORITY_LEVELS[number];