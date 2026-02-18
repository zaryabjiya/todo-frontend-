// frontend/src/components/TaskCard.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiClient } from './ApiClientProvider';
import { format } from 'date-fns';
import { Check, Clock, Calendar, Trash2, Edit2, Flag } from 'lucide-react';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    due_date?: string;
  };
  onTaskUpdate: (updatedTask: any) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskEdit: (task: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate, onTaskDelete, onTaskEdit }) => {
  const { toggleTaskCompletion } = useApiClient();

  const handleToggleCompletion = async () => {
    try {
      const updatedTask = await toggleTaskCompletion(task.user_id.toString(), task.id.toString(), !task.completed);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onTaskDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy \'at\' h:mm a');
    } catch {
      return '';
    }
  };

  const isOverdue = task.due_date && !task.completed && new Date(task.due_date) < new Date();
  const isDueToday = task.due_date && !task.completed && 
    format(new Date(task.due_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        task.completed
          ? 'bg-gradient-to-br from-green-50/80 to-emerald-50/50 border-green-200/50 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800/30'
          : 'bg-gradient-to-br from-white/80 to-gray-50/50 border-gray-200/50 dark:from-gray-900/80 dark:to-gray-800/50 dark:border-gray-700/50'
      } backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/10`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${
        task.completed
          ? 'bg-gradient-to-b from-green-400 to-emerald-500'
          : isOverdue
          ? 'bg-gradient-to-b from-red-400 to-rose-500'
          : isDueToday
          ? 'bg-gradient-to-b from-amber-400 to-orange-500'
          : 'bg-gradient-to-b from-purple-400 to-blue-500'
      }`} />

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          {/* Custom Checkbox with Beautiful Blue Checkmark */}
          <motion.button
            onClick={handleToggleCompletion}
            className="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-full"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                task.completed
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 shadow-lg shadow-blue-500/40'
                  : 'bg-transparent border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
              animate={task.completed ? { scale: [1, 1.1, 1] } : {}}
              transition={task.completed ? { duration: 0.3 } : {}}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -45 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3
                  className={`text-base font-semibold transition-all duration-500 leading-tight ${
                    task.completed
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </h3>

                {/* Description */}
                {task.description && (
                  <p className={`mt-2 text-sm transition-all duration-500 leading-relaxed ${
                    task.completed
                      ? 'text-gray-400 dark:text-gray-600 line-through'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {task.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {/* Created Date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created {formatDateTime(task.created_at)}</span>
                  </div>

                  {/* Due Date */}
                  {task.due_date && (
                    <div className={`flex items-center gap-1.5 text-xs ${
                      isOverdue
                        ? 'text-red-600 dark:text-red-400 font-medium'
                        : isDueToday
                        ? 'text-amber-600 dark:text-amber-400 font-medium'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due {formatDate(task.due_date)}</span>
                    </div>
                  )}

                  {/* Completed Date */}
                  {task.completed && task.completed_at && (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>Completed {formatDate(task.completed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex flex-col items-end gap-2">
                {/* Status Badge */}
                <motion.span
                  layout
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${
                    task.completed
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-300'
                      : isOverdue
                      ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/50 dark:to-rose-900/50 dark:text-red-300'
                      : isDueToday
                      ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/50 dark:to-orange-900/50 dark:text-amber-300'
                      : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 dark:from-purple-900/50 dark:to-blue-900/50 dark:text-purple-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    task.completed
                      ? 'bg-green-500'
                      : isOverdue
                      ? 'bg-red-500 animate-pulse'
                      : isDueToday
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-purple-500'
                  }`} />
                  {task.completed ? 'Done' : isOverdue ? 'Overdue' : isDueToday ? 'Today' : 'Active'}
                </motion.span>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.button
                    onClick={() => onTaskEdit(task)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-200"
                    title="Edit task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
