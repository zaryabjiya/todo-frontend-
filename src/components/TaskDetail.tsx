// frontend/src/components/TaskDetail.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from './ApiClientProvider';
import { useAuth } from '../providers/AuthProvider';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface TaskDetailProps {
  taskId: string;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId }) => {
  const { user } = useAuth();
  const { getTask, updateTask, deleteTask, toggleTaskCompletion } = useApiClient();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    if (user && taskId) {
      fetchTask();
    }
  }, [user, taskId]);

  const fetchTask = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response: any = await getTask(user.id.toString(), taskId);
      const fetchedTask = response;

      if (fetchedTask) {
        setTask(fetchedTask);
        setEditForm({
          title: fetchedTask.title,
          description: fetchedTask.description || '',
          due_date: fetchedTask.due_date ? new Date(fetchedTask.due_date).toISOString().slice(0, 16) : '',
        });
      } else {
        setError('Task not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompletion = async () => {
    if (!task || !user) return;

    try {
      const updatedTask = await toggleTaskCompletion(user.id.toString(), task.id.toString(), !task.completed);
      setTask(updatedTask);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!task || !user) return;

    try {
      const payload: any = {
        title: editForm.title,
        description: editForm.description || undefined,
      };
      
      if (editForm.due_date) {
        payload.due_date = new Date(editForm.due_date).toISOString();
      }
      
      const updatedTask = await updateTask(user.id.toString(), task.id.toString(), payload);
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleCancel = () => {
    if (task) {
      setEditForm({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!task || !user) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(user.id.toString(), task.id.toString());
        router.push('/tasks');
      } catch (err: any) {
        setError(err.message || 'Failed to delete task');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleChange}
              className="text-lg leading-6 font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          ) : (
            <h3 className="text-lg leading-6 font-medium text-gray-900">{task.title}</h3>
          )}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              task.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {task.completed ? 'Completed' : 'Active'}
            </span>
            <button
              onClick={handleToggleCompletion}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                task.description || <span className="text-gray-400 italic">No description provided</span>
              )}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={handleToggleCompletion}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
                <span className="ml-2">
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Due Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="datetime-local"
                  name="due_date"
                  value={editForm.due_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                task.due_date ? (
                  <span>{new Date(task.due_date).toLocaleString()}</span>
                ) : (
                  <span className="text-gray-400 italic">No due date</span>
                )
              )}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(task.created_at).toLocaleString()}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(task.updated_at).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
