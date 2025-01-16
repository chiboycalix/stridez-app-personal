"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../../../components/Spinner";
import { XIcon } from "lucide-react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { formatFileSize } from "@/utils";

type PostUploadModalProps = {
  handleClose: () => void;
  handleNext: (files: File[]) => void;
  isOpen: boolean;
};

type Location = {
  latitude: number;
  longitude: number;
};

const PostUploadModal: React.FC<PostUploadModalProps> = ({
  handleClose,
  handleNext,
  isOpen,
}) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"video" | "image" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);

    const files = Array.from(e.target.files || []);
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // Check file size
    if (files.some((file) => file.size > 20000000)) {
      setAlert("File size should be less than 20MB");
      setLoading(false);
      return;
    }

    // Validation for number of files
    if (
      videoFiles.length > 1 ||
      imageFiles.length > 5 ||
      (videoFiles.length === 1 && imageFiles.length > 0)
    ) {
      setAlert("You can upload only 1 video or up to 5 images.");
      setLoading(false);
      return;
    }

    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
    setFileType(files[0].type.startsWith("video") ? "video" : "image");
    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
    setFileType(files[0].type.startsWith("video") ? "video" : "image");
  };

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  const handleGetDeviceId = async () => {
    try {
      const res = await fetch("https://api.ipify.org/?format=json");
      const data = await res.json();
      if (res.ok) {
        setDeviceId(data.ip);
      }
    } catch (error) {
      console.log("Error fetching device ID:", error);
    }
  };

  const handleDelete = (indexToRemove: number) => {
    setMediaFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const renderThumbnails = () => {
    return mediaFiles.map((file, index) => (
      <div
        key={index}
        className="flex border rounded-xl p-2.5 gap-2.5 items-center relative"
      >
        {file.type.startsWith("image") ? (
          <div className="w-10 h-10 aspect-square">
            <img
              src={URL.createObjectURL(file)}
              className="bg-cover w-full h-full object-cover rounded-md"
              alt="Preview"
            />
          </div>
        ) : (
          <video className="w-10 h-10 aspect-square" width="100" muted>
            <source src={URL.createObjectURL(file)} type="video/mp4" />
          </video>
        )}
        <div>
          <p className="text-xs font-medium line-clamp-1">{file.name}</p>
          <p className="text-[10px]">{formatFileSize(file.size)}</p>
        </div>
        <XIcon
          className="h-4 w-4 p-px rounded-full bg-white border absolute -top-2 -right-2 cursor-pointer"
          onClick={() => handleDelete(index)}
        />
      </div>
    ));
  };

  useEffect(() => {
    handleGetLocation();
    handleGetDeviceId();
  }, [handleGetLocation]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition show={isOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-50" onClose={handleClose}>
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

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl"
                onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.stopPropagation()
                }
              >
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="h-6 w-6" />
                </button>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Upload File
                  </h3>
                  <p className="text-xs">Add your videos & pictures here</p>
                </div>

                <div
                  className="drag-drop-area mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                  onClick={handleFileClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*, video/*"
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
                      Max 20 MB files are allowed
                    </p>
                  </div>
                </div>

                {loading && <Spinner />}

                {mediaFiles.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {renderThumbnails()}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleNext(mediaFiles)}
                    disabled={mediaFiles.length === 0}
                    className="bg-primary text-sm text-white px-4 py-2 rounded-lg"
                  >
                    Next
                  </button>
                </div>

                {alert && <p className="text-red-500 text-sm mt-2">{alert}</p>}
              </motion.div>
            </div>
          </Dialog>
        </Transition>
      )}
    </AnimatePresence>
  );
};

export default PostUploadModal;
