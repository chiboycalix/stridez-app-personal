"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PostMediaPreview from "./PostMediaPreview";
import { useAuth } from "@/context/AuthContext";
import { XIcon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type PostDetailsInputModalProps = {
  mediaFiles: [];
  pageBack: () => void;
  handleClose: () => void;
};

const PostDetailsInputModal = ({
  mediaFiles,
  pageBack,
  handleClose,
}: PostDetailsInputModalProps) => {
  const { getCurrentUser } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<object | null>(null);
  const [deviceId, setDeviceId] = useState(null);

  const tagInputRef = useRef(null);
  const userId = getCurrentUser().id;

  const baseUrl = process.env.NEXT_PUBLIC_BASEURL;
  const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  type mediaItemTpye = {
    url: string;
    title: string;
    description: string;
    mimeType: string;
  };

  // Fetch Device ID
  const handleGetDeviceId = async () => {
    const res = await fetch("https://api.ipify.org/?format=json");
    const data = await res.json();
    setDeviceId(data.ip);
  };

  // Get current geolocation
  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        () => console.log("Unable to retrieve location")
      );
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  // Add a new tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      const newTag = `${target.value.trim()}`;
      if (newTag && !tags.includes(newTag)) {
        e.preventDefault();
        setTags((prevTags) => [...prevTags, newTag]);
      }
      target.value = "";
    }
  };

  // Remove a tag
  const handleRemoveTag = (indexToRemove: number) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Helper function to load data from localStorage
  const loadFromLocalStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  // Handle media uploads to Cloudinary with restrictions
  const uploadMediaToCloudinary = async (mediaFiles: File[]) => {
    const savedMedia = loadFromLocalStorage("cloudinaryMedia");

    // Check if media has already been uploaded
    if (savedMedia && savedMedia.length === mediaFiles.length) {
      return savedMedia; // Use previously uploaded media data
    }

    //check and ensure that size of each mediafile does not exceed 20mb
    const mediaSizeLimit = 20 * 1024 * 1024; // 20MB

    const mediaUploads = mediaFiles?.map(async (file) => {
      if (file.size > mediaSizeLimit) {
        setAlert("File size is too large, maximum file size is 20MB");
        throw new Error("File size is too large");
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset!);
      formData.append("folder", "Stridez/posts");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${uploadUrl}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      return await response.json();
    });

    const uploadedMedia = await Promise.all(mediaUploads);

    saveToLocalStorage("cloudinaryMedia", uploadedMedia);
    console.log("Saved to local storage", uploadedMedia);
    return uploadedMedia;
  };

  // Function to handle form submission
  const handleSubmitPost = async () => {
    setLoading(true);

    try {
      //load media files from local storage
      const savedMedia = loadFromLocalStorage("cloudinaryMedia");
      // Upload the media files to Cloudinary (or use saved media from localStorage)
      const uploadedMedia = await uploadMediaToCloudinary(mediaFiles);

      console.log("Uploaded media:", uploadedMedia);

      // Prepare the media details for the backend request
      const media = uploadedMedia?.map((mediaItem: any) => ({
        url: mediaItem?.secure_url,
        title: title,
        description: description,
        mimeType: mediaItem?.resource_type === "video" ? "video/*" : "image/*",
      }));

      console.log("Media:", media);

      // Prepare the post data
      const requestBody = {
        title: title,
        body: description,
        tags: tags,
        thumbnailUrl: uploadedMedia[0].secure_url,
        location: JSON.stringify(location),
        deviceId: deviceId,
        media: savedMedia ? savedMedia : media,
      };

      // Send the post data to the backend
      const postResponse = await fetch(`${baseUrl}/posts`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!postResponse.ok) {
        throw new Error("Failed to create post");
      }

      const postData = await postResponse.json();
      console.log("Post created:", postData);
      setAlert(postData.data.message);

      // Clear localStorage upon successful post creation
      localStorage.removeItem("cloudinaryMedia");
      console.log("Cleared local storage");
      router.push(`/profile/${userId}`);
    } catch (error) {
      console.log("Error creating post:", error);
      setAlert("Failed to upload post");
    } finally {
      setLoading(false);
    }
  };

  // Fetch location and device ID when component mounts
  useEffect(() => {
    handleGetLocation();
    handleGetDeviceId();
  }, [handleGetLocation]);

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
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-3 relative flex gap-3"
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
          {mediaFiles.length > 0 ? (
            mediaFiles.map((file, index) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PostMediaPreview file={file} iconSize={false} />
              </motion.div>
            ))
          ) : (
            <p>No media available</p>
          )}
        </div>

        {/* Post Input Form */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create Post
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 outline-none rounded-lg focus:ring focus:ring-primary focus:border-primary"
              placeholder="Enter post title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 outline-none rounded-lg focus:ring focus:ring-primary focus:border-primary"
              placeholder="Enter post description"
            />
          </div>

          {/* Tags Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              placeholder="Add a tag"
              onKeyDown={handleAddTag}
              className="w-full mt-1.5 p-2 border border-gray-300 outline-none rounded-md focus:ring focus:ring-primary focus:border-primary"
              ref={tagInputRef}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <motion.div
                  key={index}
                  className="bg-primary text-white px-2 py-1 text-sm rounded-md flex items-center"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  {tag}
                  <button
                    className="ml-2"
                    onClick={() => handleRemoveTag(index)}
                  >
                    &times;
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Alert and Submit Section */}
          {alert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-500"
            >
              {alert}
            </motion.div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={handleSubmitPost}
              className="bg-primary text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit Post"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetailsInputModal;
