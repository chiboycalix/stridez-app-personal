import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect } from "react";

const Toastify = ({ message }: { message: string }) => {
  useEffect(() => {
    if (message) {
      toast.success(message, {
        className: "bg-white text-purple-700",
        progressClassName: "bg-purple-700",
      });
    }
  }, [message]);

  return <ToastContainer />;
};


export default Toastify;
