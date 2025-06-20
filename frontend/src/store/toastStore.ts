import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 3000, // 3 seconds default
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));

// Helper functions for common toast types
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) => {
    useToastStore.getState().addToast({
      type: 'success',
      title,
      message,
      ...options,
    });
  },

  error: (title: string, message?: string, options?: Partial<Toast>) => {
    useToastStore.getState().addToast({
      type: 'error',
      title,
      message,
      duration: 3000, 
      ...options,
    });
  },

  warning: (title: string, message?: string, options?: Partial<Toast>) => {
    useToastStore.getState().addToast({
      type: 'warning',
      title,
      message,
      ...options,
    });
  },

  info: (title: string, message?: string, options?: Partial<Toast>) => {
    useToastStore.getState().addToast({
      type: 'info',
      title,
      message,
      ...options,
    });
  },
};