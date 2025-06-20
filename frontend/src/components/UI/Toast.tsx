import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Toast as ToastType, useToastStore } from '../../store/toastStore';

interface ToastProps {
  toast: ToastType;
}

const ToastComponent: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToastStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4 shadow-soft-lg";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500`;
    }
  };

  return (
    <div
      className={`
        ${getStyles()}
        rounded-lg p-4 mb-3 max-w-md w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-brand-navy mb-1">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {toast.message}
            </p>
          )}
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-brand-orange hover:text-orange-600 transition-colors"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );
};