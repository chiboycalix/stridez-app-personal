"use client";

import React, { useState, useRef } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { Transition, TransitionChild } from "@headlessui/react";

type CourseUploadModalProps = {
  handleNext: (files: File[]) => void;
  handleClose: () => void;
  isOpen: boolean;
};

const CourseUploadModal: React.FC<CourseUploadModalProps> = ({
  handleNext,
  handleClose,
  isOpen,
}) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);

    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("video")
    );

    if (mediaFiles.length + files.length > 5) {
      alert("You can upload a maximum of 5 video files.");
      setLoading(false);
      return;
    }

    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
    setLoading(false);
  };

  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Function to handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("video")
    );

    if (mediaFiles.length + files.length > 5) {
      alert("You can upload a maximum of 5 video files.");
      return;
    }

    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const renderThumbnails = () => {
    if (!mediaFiles || mediaFiles.length === 0) {
      return null;
    }

    return mediaFiles.map((file, index) => (
      <div
        key={index}
        className="flex gap-2 items-center border p-2 rounded-lg shadow-sm"
      >
        {file.type.startsWith("image") ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-20 h-20 rounded-md object-cover"
          />
        ) : (
          <video width="100" controls className="w-20 h-20 rounded-md">
            <source src={URL.createObjectURL(file)} type="video/mp4" />
          </video>
        )}
        <p className="text-sm">{file.name}</p>
      </div>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition show={isOpen} as={React.Fragment}>
          {/* Overlay */}
          <TransitionChild
            as={motion.div}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 bg-black bg-opacity-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="modal-content max-w-md mx-auto bg-white rounded-lg shadow-xl p-6"
                onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.stopPropagation()
                }
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
              >
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="h-6 w-6" />
                </button>

                <h2 className="text-lg font-semibold text-gray-900">
                  Upload Videos
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Add your videos here; (max 5)
                </p>

                <div
                  className="drag-drop-area p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                  onClick={handleFileClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                    multiple
                  />
                  <div className="flex flex-col items-center">
                    <MdOutlineCloudUpload className="h-12 w-12 mb-2 text-primary" />
                    <p className="text-sm text-gray-500">
                      Drag & Drop file or{" "}
                      <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Max 5 videos allowed
                    </p>
                  </div>
                </div>

                {loading && (
                  <p className="text-sm text-gray-500 mt-2">Loading...</p>
                )}

                {mediaFiles.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {renderThumbnails()}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleNext(mediaFiles)}
                    className="bg-primary text-sm text-white px-4 py-2 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Transition>
      )}
    </AnimatePresence>
  );
};

export default CourseUploadModal;
