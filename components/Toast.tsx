// components/Toast.tsx

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastProps, ToastVariant } from '../types/toast';

interface VariantConfig {
  icon: typeof CheckCircle;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

const VARIANTS: Record<ToastVariant, VariantConfig> = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    bgColor: 'bg-white',
    borderColor: 'border-l-green-500'
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-white',
    borderColor: 'border-l-red-500'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-white',
    borderColor: 'border-l-yellow-500'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    bgColor: 'bg-white',
    borderColor: 'border-l-blue-500'
  }
};

const Toast: React.FC<ToastProps> = ({
  variant = 'success',
  title,
  message,
  onClose,
  show = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Trigger entrance animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // Trigger exit animation
      setIsVisible(false);
    }
  }, [show]);

  const { icon: Icon, iconColor, bgColor, borderColor } = VARIANTS[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed top-4 right-4 z-50
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <div
        className={`
          ${bgColor} 
          ${borderColor}
          min-w-80 
          p-4 
          shadow-lg 
          rounded-lg 
          border-l-4
          relative
        `}
      >
        <div className="flex gap-3">
          <Icon className={`${iconColor} w-5 h-5 mt-0.5`} />
          <div className="flex-1">
            {title && (
              <h5 className="font-medium text-gray-900">
                {title}
              </h5>
            )}
            {message && (
              <p className="text-gray-600 text-sm mt-1">
                {message}
              </p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;