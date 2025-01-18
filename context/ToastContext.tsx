"use client"
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import Toast from '../components/Toast';
import { ToastContextType, ToastProps, ToastProviderProps, ToastVariant } from '../types/toast';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const toastTimeouts = useRef<Map<string | number, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string | number) => {
    // Clear any existing timeout for this toast
    if (toastTimeouts.current.has(id)) {
      clearTimeout(toastTimeouts.current.get(id));
      toastTimeouts.current.delete(id);
    }

    setToasts(prev => {
      // First, mark the toast for removal to trigger exit animation
      const updatedToasts = prev.map(toast =>
        toast.id === id ? { ...toast, show: false } : toast
      );

      // Then, actually remove the toast after animation completes
      setTimeout(() => {
        setToasts(current => current.filter(t => t.id !== id));
      }, 300); // Match animation duration

      return updatedToasts;
    });
  }, []);

  const showToast = useCallback((variant: ToastVariant, title: string, message?: string) => {
    const id = Date.now();
    const newToast: ToastProps = {
      id,
      variant,
      title,
      message,
      show: true
    };

    setToasts(prev => [...prev, newToast]);

    // Set auto-remove timeout (5 seconds + animation duration)
    const timeout = setTimeout(() => {
      removeToast(id);
    }, 5000);

    toastTimeouts.current.set(id, timeout);

    // Cleanup timeouts when component unmounts
    return () => {
      if (toastTimeouts.current.has(id)) {
        clearTimeout(toastTimeouts.current.get(id));
        toastTimeouts.current.delete(id);
      }
    };
  }, [removeToast]);

  const contextValue: ToastContextType = {
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};