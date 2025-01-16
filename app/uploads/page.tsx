"use client";

import React, { useState, useCallback, useEffect } from "react";
import CourseUploadModal from "./uploads-component/CourseUploadModal";
import PostUploadModal from "./uploads-component/PostUploadModal";
import PostDetailsInputModal from "./uploads-component/PostDetailsInputModal";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CourseDetailsInputModal from "./uploads-component/CourseDetailsInputModal";

export default function Upload() {
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [useSameDetailsForAll, setUseSameDetailsForAll] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[] | any>([]);
  const [step, setStep] = useState(1);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleNext = useCallback(
    (files: File[]) => {
      setMediaFiles(files);
      setStep(step + 1);
      setShowPostModal(true);
      console.log("Media files:", files);
      console.log("Step:", step, showCourseModal);
    },
    [step, showCourseModal]
  );

  const handleBack = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleClose = () => {
    setShowPostModal(false);
    setShowCourseModal(false);
    setStep(1);
    setMediaFiles([]);
  };

  const handleToggle = () => {
    setUseSameDetailsForAll((prev) => !prev);
  };

  useEffect(() => {
    if (!isAuthenticated && !Cookies.get("accessToken")) {
      router.push("/auth?tab=signin");
    }
  });

  return (
    <div className="min-h-[85vh] w-full flex justify-center items-center bg-gray-100">
      <div className="grid grid-cols-1 gap-4 max-w-md">
        {/* Card for Create Post */}
        <div
          className="group relative bg-white p-3 rounded-3xl shadow-sm hover:shadow-lg hover:bg-primary/10 transition-all duration-300 cursor-pointer"
          onClick={() => setShowPostModal(true)}
        >
          <div className="flex items-center">
            <MdOutlineVideoLibrary className="text-5xl p-2.5 rounded-xl bg-gray-300 group-hover:bg-primary/25 text-gray-900 group-hover:text-primary transition-colors duration-300" />
            <h3 className="ml-2 text-md">Upload Short Videos</h3>
          </div>
          <p className="text-gray-500 mt-3 p-2.5 text-sm border group-hover:border-primary/5 rounded-xl group-hover:text-gray-700">
            Use this section to upload your short videos to advertise your
            courses
          </p>
        </div>

        {/* Card for Upload Course */}
        <div
          className="group relative bg-white p-3 rounded-3xl shadow-sm hover:shadow-lg hover:bg-primary/10 transition-all duration-300 cursor-pointer"
          onClick={() => setShowCourseModal(true)}
        >
          <div className="flex items-center">
            <IoBookOutline className="text-5xl p-2.5 rounded-xl bg-gray-300 group-hover:bg-primary/25 text-gray-900 group-hover:text-primary transition-colors duration-300" />
            <h3 className="ml-2 text-md">Upload Courses and Lessons</h3>
          </div>

          <p className="text-gray-500 mt-3 p-2.5 text-sm border group-hover:border-primary/5 rounded-xl group-hover:text-gray-700">
            Use this section to upload your course materials, which can be
            either documents or videos.
          </p>
        </div>
      </div>

      {/* Post Upload Modal */}
      {showPostModal && step === 1 && (
        <PostUploadModal
          handleNext={handleNext}
          handleClose={handleClose}
          isOpen={showPostModal}
        />
      )}

      {/* Post Details Input Modal */}
      {showPostModal && step === 2 && (
        <PostDetailsInputModal
          mediaFiles={mediaFiles}
          pageBack={handleBack}
          handleClose={handleClose}
        />
      )}

      {/* Course Upload Modal */}
      {showCourseModal && step === 1 && (
        <CourseUploadModal
          handleNext={handleNext}
          handleClose={handleClose}
          isOpen={showCourseModal}
        />
      )}

      {/* Course Details Input Modal */}
      {showCourseModal && step === 2 && (
        <CourseDetailsInputModal
          mediaFiles={mediaFiles}
          pageBack={handleBack}
          handleClose={handleClose}
          handleToggle={handleToggle}
        />
      )}
    </div>
  );
}
