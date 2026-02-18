// frontend/src/app/tasks/page.tsx
'use client';

import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import TaskList from '../../components/TaskList';
import { useAuth } from '../../providers/AuthProvider';

export default function TasksPage() {
  const { user } = useAuth();

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
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="pb-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Tasks</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage your tasks efficiently. Create, update, and track your progress.
                </p>
              </div>
              <div className="mt-5">
                {user && <TaskList userId={user.id.toString()} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
