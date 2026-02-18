// frontend/src/components/TaskSkeleton.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TaskSkeleton: React.FC = () => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border rounded-lg p-4 mb-3 bg-white"
    >
      <div className="flex items-start">
        <div className="mt-1 h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskSkeleton;