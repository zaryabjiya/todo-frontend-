// frontend/src/components/TaskList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useApiClient } from './ApiClientProvider';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskSkeleton from './TaskSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  userId: string;
}

const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const { getUserTasks, createTask, updateTask, deleteTask, toggleTaskCompletion } = useApiClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response: any = await getUserTasks(userId);
      setTasks(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSave = (task: any) => {
    console.log('Saving task, editingTask:', editingTask, 'task:', task);
    if (editingTask) {
      // Update existing task in the list
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      // Add new task to the list
      setTasks(prev => [...prev, task]);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleTaskUpdate = (updatedTask: any) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await deleteTask(userId, taskId.toString());
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleToggleCompletion = async (taskId: number, completed: boolean) => {
    try {
      const updatedTask = await toggleTaskCompletion(userId, taskId.toString(), completed);
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
    } catch (err: any) {
      setError(err.message || 'Failed to update task completion');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800"
          >
            Your Tasks
          </motion.h2>
          <div className="bg-gray-200 rounded-md px-4 py-2 animate-pulse">
            <span className="text-gray-500">Add Task</span>
          </div>
        </div>
        <div className="mb-6 flex space-x-2">
          <div className="bg-gray-200 rounded-md px-3 py-1 animate-pulse w-16"></div>
          <div className="bg-gray-200 rounded-md px-3 py-1 animate-pulse w-16"></div>
          <div className="bg-gray-200 rounded-md px-3 py-1 animate-pulse w-16"></div>
        </div>
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        role="alert"
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
        >
          Add Task
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex space-x-2"
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filter === 'active'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filter === 'completed'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </motion.div>

      {showForm && (
        <TaskForm
          userId={userId}
          task={editingTask}
          onSave={handleTaskSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      <AnimatePresence>
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No tasks found. Create your first task!</p>
          </motion.div>
        ) : (
          <motion.div layout>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onTaskUpdate={(updatedTask) => handleTaskUpdate(updatedTask)}
                onTaskDelete={(taskId) => handleTaskDelete(taskId)}
                onTaskEdit={(task) => handleEditTask(task)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
