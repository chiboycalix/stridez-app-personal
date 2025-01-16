import React, { useState, useEffect } from 'react';
import { HandIcon, X } from 'lucide-react';

type JoinRequestNotificationProps = {
  requesterName: string;
  onAllow?: () => void;
  onDeny?: () => void;
  onClose?: () => void;
  autoHideAfter?: number;
}
const JoinRequestNotification = ({
  requesterName,
  onAllow,
  onDeny,
  onClose,
  autoHideAfter = 1000000
}: JoinRequestNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, autoHideAfter);

    return () => clearTimeout(timer);
  }, [autoHideAfter, onClose]);

  if (!isVisible) return null;
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg w-[90%] md:w-[560px] max-h-[80vh] overflow-y-auto">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-72 border-gray-600 border-l-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 flex items-center gap-2">
            <HandIcon className="w-5 h-5 text-white" />
            <p className="text-white text-sm">
              {requesterName} requests to join
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="text-gray-400 hover:text-gray-300 ml-2"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              onAllow?.();
              setIsVisible(false);
            }}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-1.5 px-3 rounded"
          >
            Allow
          </button>
          <button
            onClick={() => {
              onDeny?.();
              setIsVisible(false);
            }}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-1.5 px-3 rounded"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRequestNotification;