import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[85vh] w-full">
      <div className="flex flex-col items-center space-y-2">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
