import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useCallback } from "react";

interface ToastifyProps {
  message: string;
  onClose?: () => void;
}

const Toastify = ({ message, onClose }: ToastifyProps) => {
  const showToast = useCallback(() => {
    if (message) {
      const toastId = toast.success(message, {
        className: "bg-white text-purple-700",
        progressClassName: "bg-purple-700",
        autoClose: 3000,
        onClose: () => {
          if (onClose) {
            onClose();
          }
        },
      });

      // Force close after 3 seconds as a fallback
      setTimeout(() => {
        toast.dismiss(toastId);
        if (onClose) {
          onClose();
        }
      }, 3000);
    }
  }, [message, onClose]);

  useEffect(() => {
    if (message) {
      showToast();
    }
  }, [message, showToast]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Toastify;