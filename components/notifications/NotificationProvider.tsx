"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { showToast } from './NotificationToast';

interface NotificationContextType {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showSuccess = useCallback((title: string, message: string) => {
    showToast({ type: 'success', title, message });
  }, []);

  const showError = useCallback((title: string, message: string) => {
    showToast({ type: 'error', title, message });
  }, []);

  const showInfo = useCallback((title: string, message: string) => {
    showToast({ type: 'info', title, message });
  }, []);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
