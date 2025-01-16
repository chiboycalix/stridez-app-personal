"use client";

import React, { useEffect, useState, useCallback } from "react";
import CourseMediaPreview from "./CourseMediaPreview";
import { useAuth } from "@/context/AuthContext";
import { XIcon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/constant";

type CourseDetailsInputModalProps = {
  mediaFiles: any;
  pageBack: () => void;
  handleClose: () => void;
  handleToggle?: () => void;
};
const CourseDetailsInputModal = ({
  pageBack,
  mediaFiles,
  handleClose,
}: CourseDetailsInputModalProps) => {
  const [loading, setLoading] = useState(false);
  const [individualTitles, setIndividualTitles] = useState(
    mediaFiles.map(() => "")
  );
  const [individualDescriptions, setIndividualDescriptions] = useState(
    mediaFiles.map(() => "")
  );
  const [sameTitle, setSameTitle] = useState("");
  const [sameDescription, setSameDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [useSameDetailsForAll, setUseSameDetailsForAll] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [isFolder, setIsFolder] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderName, setFolderName] = useState("");
  const [existingFolders, setExistingFolders] = useState([]);
  const { getCurrentUser } = useAuth();
  const userId = getCurrentUser().id;
  const router = useRouter();

  const fetchFolderList = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/users/${userId}/courses/?page=1&limit=50`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }

      const data = await response.json();
      const folders = data?.data.courses.map((course: any) => course?.title);
      setExistingFolders(folders);
    } catch (error) {
      console.log("Error fetching folders:", error);
    }
  }, [baseUrl, userId]);

  const handleToggleSwitch = () => {
    setIsFolder((prev) => !prev);
  };

  const handleToggle = () => {
    setUseSameDetailsForAll((prev) => !prev);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const newTag = `${target.value.trim()}`;
      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
      target.value = "";
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDescriptionChange = (e: any, index: number) => {
    const updatedDescriptions = [...individualDescriptions];
    updatedDescriptions[index] = e.target.value;
    setIndividualDescriptions(updatedDescriptions);
  };

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage?.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {
    fetchFolderList();
  }, [fetchFolderList]);

  const handleSubmitCourses = async () => {
    setLoading(true);
    try {
      const mediaUploads =
        mediaFiles?.length > 0 &&
        mediaFiles?.map(async (file: File, index: number) => {
          const data = new FormData();
          data.append("file", file);
          data.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
          );
          data.append(
            "cloud_name",
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
          );
          data.append("folder", "Stridez/courses");
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            {
              method: "POST",
              body: data,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to upload file");
          }

          const responseData = await response.json();

          return {
            url: responseData.secure_url,
            title: useSameDetailsForAll ? sameTitle : individualTitles[index],
            description: useSameDetailsForAll
              ? sameDescription
              : individualDescriptions[index],
            mimeType: "video/*",
          };
        });

      const media = await Promise.all(mediaUploads);

      // Save uploaded media to localStorage
      saveToLocalStorage("uploadedMedia", media);

      // Prepare the request body for the course creation
      const requestBody = {
        title: folderName,
        description: useSameDetailsForAll
          ? sameDescription
          : individualDescriptions[0],
        difficultyLevel: "BEGINNER",
        tags: useSameDetailsForAll ? tags : tags,
        isPaid: false,
        media: media,
      };

      // const courseFolderName =
      const courseResponse = await fetch(`${baseUrl}/courses`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!courseResponse?.ok) {
        throw new Error("Failed to create course");
      }

      const courseData = await courseResponse?.json();
      console.log("Course created:", courseData);
      localStorage.removeItem("uploadedMedia");
      setAlert(courseData?.data.message);
      router.push(`/courses`);
    } catch (error) {
      console.log("Error uploading course:", error);
      setAlert("Failed to upload course");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedTitles = [...individualTitles];
    updatedTitles[index] = e.target.value;
    setIndividualTitles(updatedTitles);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-3 min-h-[24rem] relative flex gap-3"
      >
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {/* Back Arrow */}
        <button
          onClick={pageBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* Media Preview Section */}
        <div className="flex flex-wrap gap-2 w-1/2 justify-center items-center rounded-xl border border-gray-100 max-h-[28rem] overflow-auto">
          {mediaFiles?.length > 0 ? (
            mediaFiles?.map((file: File, index: number) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CourseMediaPreview file={file} iconSize={true} />
              </motion.div>
            ))
          ) : (
            <p>No media available</p>
          )}
        </div>

        {/* Course Input Form */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Course Details
          </h2>

          <div className="option-toggle mb-4 flex items-center">
            <Switch
              checked={isFolder}
              onChange={handleToggleSwitch}
              className={`${isFolder ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${isFolder ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
              />
            </Switch>
            <span className="ml-2 text-gray-700">
              Create a folder for multiple files
            </span>
          </div>

          {isFolder && (
            <div className="folder-selection mb-4">
              <label className="block mb-2">Select a Folder</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Choose an existing folder</option>
                {existingFolders?.length > 0 &&
                  existingFolders?.map((folder, index) => (
                    <option key={index} value={folder}>
                      {folder}
                    </option>
                  ))}
                <option value="new">Create New Folder</option>
              </select>

              {selectedFolder === "new" && (
                <div className="mb-4">
                  <label className="block mb-2">New Folder Name</label>
                  <input
                    type="text"
                    placeholder="Enter folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="toggle-details mb-4 flex items-center">
            <span className="mr-2">Use same details for all uploads:</span>
            <Switch
              checked={useSameDetailsForAll}
              onChange={handleToggle}
              className={`${useSameDetailsForAll ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${useSameDetailsForAll ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
              />
            </Switch>
          </div>

          {useSameDetailsForAll ? (
            <div className="same-details-form">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter title"
                onChange={(e) => setSameTitle(e.target.value)}
                value={sameTitle || ""}
                className="w-full p-2 border rounded mb-4"
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Enter description"
                value={sameDescription || ""}
                onChange={(e) => {
                  setSameDescription(e.target.value);
                }}
                className="w-full p-2 border rounded mb-4"
                required
              />

              <label>Tags</label>
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                onKeyDown={handleAddTag}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex flex-wrap">
                {tags?.length > 0 &&
                  tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-200 rounded-full px-2 py-1 mr-2 mb-2"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(index)}
                        className="ml-1 text-red-500"
                      >
                        x
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            mediaFiles?.length > 0 &&
            mediaFiles?.map((_: any, index: number) => (
              <div key={index} className="individual-detail-form mb-4">
                <label>Title for File {index + 1}</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={
                    individualTitles?.length > 0 ? individualTitles[index] : ""
                  }
                  onChange={(e) => handleTitleChange(e, index)}
                  className="w-full p-2 border rounded mb-2"
                  required
                />

                <label>Description for File {index + 1}</label>
                <textarea
                  placeholder="Enter description"
                  value={
                    individualDescriptions?.length > 0
                      ? individualDescriptions[index]
                      : ""
                  }
                  onChange={(e) => handleDescriptionChange(e, index)}
                  className="w-full p-2 border rounded mb-4"
                  required
                />
              </div>
            ))
          )}

          {alert && (
            <div className="alert mt-4 p-2 bg-red-100 text-red-800 rounded">
              {alert}
            </div>
          )}
          <div className="flex justify-end items-center mt-4">
            <button
              onClick={handleSubmitCourses}
              disabled={loading}
              className={`bg-blue-500 text-white rounded px-4 py-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Submitting..." : "Submit Courses"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CourseDetailsInputModal;
