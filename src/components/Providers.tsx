// frontend/src/components/Providers.tsx
'use client';

import React from 'react';
import { AuthProvider } from '../providers/AuthProvider';
import { TaskProvider } from '../contexts/TaskContext';
import { ApiClientProvider } from './ApiClientProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ApiClientProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </ApiClientProvider>
    </AuthProvider>
  );
};
