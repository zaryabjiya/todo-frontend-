// frontend/src/components/TaskForm.tsx
'use client';

import React, { useState } from 'react';
import { useApiClient } from './ApiClientProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, AlignLeft, Tag } from 'lucide-react';

interface TaskFormProps {
  userId: string;
  task?: {
    id?: number;
    title: string;
    description?: string;
    due_date?: string;
  };
  onSave: (task: any) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ userId, task, onSave, onCancel }) => {
  const { createTask, updateTask } = useApiClient();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;
      const payload: any = {
        title: formData.title,
        description: formData.description || undefined,
      };
      
      // Only include due_date if it's set
      if (formData.due_date) {
        payload.due_date = new Date(formData.due_date).toISOString();
      }

      if (task?.id) {
        result = await updateTask(userId, task.id.toString(), payload);
      } else {
        result = await createTask(userId, payload);
      }

      onSave(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-full max-w-lg"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-6">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {task?.id ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    {task?.id ? 'Update your task details' : 'Add a new task to your list'}
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-purple-500" />
                  Title
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="What needs to be done?"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <AlignLeft className="w-4 h-4 text-blue-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                  placeholder="Add any details..."
                />
              </div>

              {/* Due Date Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Optional - Set a deadline for this task
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-5 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-50 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:shadow-purple-500/30'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    task?.id ? 'Update Task' : 'Create Task'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskForm;
