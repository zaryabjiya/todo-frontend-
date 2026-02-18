// frontend/src/app/tasks/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import UserProfileDropdown from '../../../components/UserProfileDropdown';
import TaskDetail from '../../../components/TaskDetail';
import { useApiClient } from '../../../components/ApiClientProvider';
import { useAuth } from '../../../providers/AuthProvider';

export default function TaskDetailPage() {
  const params = useParams();
  const { getTask } = useApiClient();
  const { user, loading: authLoading } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Extract taskId safely
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (user && taskId && !authLoading) {
      fetchTask();
    }
  }, [user, taskId, authLoading]);

  const fetchTask = async () => {
    if (!user || !taskId) return;
    
    try {
      setLoading(true);
      const response: any = await getTask(user.id.toString(), taskId);
      const fetchedTask = response;

      if (fetchedTask) {
        setTask(fetchedTask);
      } else {
        setError('Task not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold text-indigo-600">TaskMaster</span>
                  </div>
                  <nav className="ml-6 flex space-x-8">
                    <a
                      href="/dashboard"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/tasks"
                      className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      My Tasks
                    </a>
                  </nav>
                </div>
                <div className="flex items-center">
                  <UserProfileDropdown />
                </div>
              </div>
            </div>
          </header>

          <main>
            <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-indigo-600">TaskMaster</span>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <a
                    href="/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/tasks"
                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    My Tasks
                  </a>
                </nav>
              </div>
              <div className="flex items-center">
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
                <button
                  onClick={() => window.history.back()}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  ← Back to Tasks
                </button>
              </div>

              {task && taskId && (
                <TaskDetail taskId={taskId} />
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
