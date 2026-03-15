// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import ProgressCircle from '../../components/ProgressCircle';
import { useAuth } from '../../providers/AuthProvider';
import { useApiClient } from '../../components/ApiClientProvider';
import { getApiBaseUrl } from '../../lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, CheckCircle2, Circle, Filter, Sparkles, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserTasks, createTask } = useApiClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response: any = await getUserTasks(user!.id.toString());
      setTasks(Array.isArray(response) ? response : []);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSave = (task: any) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) {
        return prev.map(t => t.id === task.id ? task : t);
      }
      return [task, ...prev];
    });
    setShowForm(false);
    setLastUpdated(new Date());
  };

  const handleTaskUpdate = (updatedTask: any) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    setLastUpdated(new Date());
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/users/${user!.id}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleEditTask = (task: any) => {
    // Navigate to task detail page for editing
    router.push(`/tasks/${task.id}`);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
        {/* Subtle background pattern */}
        <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />
        
        {/* Header */}
        <header className="relative sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-50" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TaskMaster
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Your productivity companion
                  </p>
                </div>
              </motion.div>

              {/* User Avatar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.username || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                  {(user?.username || user?.email || 'U')[0].toUpperCase()}
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.username || 'there'}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              You've got <span className="font-semibold text-purple-600 dark:text-purple-400">{stats.active}</span> active tasks today
            </p>
          </motion.div>

          {/* Stats & Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Progress Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Progress
                </h3>
                <ProgressCircle completed={stats.completed} total={stats.total} />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-xl h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-5 border border-purple-200/50 dark:border-purple-800/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Filter className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.total}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Tasks</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-5 border border-blue-200/50 dark:border-blue-800/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Circle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.active}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-5 border border-green-200/50 dark:border-green-800/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats.completed}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Completed</p>
                  </motion.div>
                </div>

                {/* Last Updated */}
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tasks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-xl"
          >
            {/* Header with Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Tasks
              </h3>

              <div className="flex items-center gap-3">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {(['all', 'active', 'completed'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        filter === f
                          ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      {f === 'all' && <span className="ml-1.5 text-xs">({stats.total})</span>}
                      {f === 'active' && <span className="ml-1.5 text-xs">({stats.active})</span>}
                      {f === 'completed' && <span className="ml-1.5 text-xs">({stats.completed})</span>}
                    </button>
                  ))}
                </div>

                {/* Add Task Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Task</span>
                </motion.button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
                    />
                  ))
                ) : filteredTasks.length === 0 ? (
                  // Empty State
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-purple-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {filter === 'all'
                        ? "No tasks yet"
                        : filter === 'active'
                        ? "No active tasks"
                        : "No completed tasks"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {filter === 'all'
                        ? "Add your first task to get started!"
                        : filter === 'active'
                        ? "All tasks completed! Great job! 🎉"
                        : "Complete some tasks to see them here"}
                    </p>
                    {filter === 'all' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        Add Your First Task
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  // Task Cards
                  filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TaskCard
                        task={task}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskDelete={handleTaskDelete}
                        onTaskEdit={handleEditTask}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>

        {/* Task Creation Modal */}
        {showForm && (
          <TaskForm
            userId={user!.id.toString()}
            onSave={handleTaskSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
