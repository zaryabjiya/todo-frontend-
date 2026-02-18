// frontend/src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { useApiClient } from '../components/ApiClientProvider';
import { Task } from '../lib/types';
import { useAuth } from '../providers/AuthProvider';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: { title: string; description?: string }) => Promise<void>;
  updateTask: (taskId: number, taskData: Partial<{ title: string; description?: string; completed: boolean }>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleTaskCompletion: (taskId: number) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const { getUserTasks, createTask: apiCreateTask, updateTask: apiUpdateTask, deleteTask: apiDeleteTask, toggleTaskCompletion: apiToggleTaskCompletion } = useApiClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response: any = await getUserTasks(user.id.toString());
      setTasks(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: { title: string; description?: string }) => {
    if (!user) return;

    try {
      setError(null);
      const response: any = await apiCreateTask(user.id.toString(), taskData);
      setTasks(prev => [...prev, response]);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    }
  };

  const updateTask = async (taskId: number, taskData: Partial<{ title: string; description?: string; completed: boolean }>) => {
    if (!user) return;

    try {
      setError(null);
      const response: any = await apiUpdateTask(user.id.toString(), taskId.toString(), taskData);
      setTasks(prev => prev.map(task => task.id === taskId ? response : task));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!user) return;

    try {
      setError(null);
      await apiDeleteTask(user.id.toString(), taskId.toString());
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    if (!user) return;

    try {
      setError(null);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response: any = await apiToggleTaskCompletion(user.id.toString(), taskId.toString(), !task.completed);
      setTasks(prev => prev.map(task => task.id === taskId ? response : task));
    } catch (err: any) {
      setError(err.message || 'Failed to update task completion');
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};
