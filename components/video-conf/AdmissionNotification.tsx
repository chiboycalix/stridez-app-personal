import { motion } from "framer-motion";
import { X } from "lucide-react";

interface AdmissionNotificationProps {
  requesterName: string;
  onAllow: () => void;
  onDeny: () => void;
}

export function AdmissionNotification({
  requesterName,
  onAllow,
  onDeny
}: AdmissionNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Join Request</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {requesterName} wants to join the meeting
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onDeny}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
        >
          Deny
        </button>
        <button
          onClick={onAllow}
          className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-600"
        >
          Admit
        </button>
      </div>
    </motion.div>
  );
}