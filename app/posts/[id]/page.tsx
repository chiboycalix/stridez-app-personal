"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostModal from "@/components/post/post-modal";
import { PostType, usePost } from "@/context/PostContext";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";

export default function PostModalWrapper() {
  const { getCurrentUser } = useAuth();
  const router = useRouter();
  const { fetchPostDetail } = usePost();
  const { setIsGloballyPaused } = useVideoPlayback();
  const [postDetail, setPostDetail] = useState<PostType | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id && typeof id === "string") {
      const parsedId = parseInt(id, 10);

      if (!isNaN(parsedId)) {
        const res = fetchPostDetail(parsedId);
        setPostDetail(res);
      } else {
        console.log("Invalid ID:", id);
      }
    }
    setIsGloballyPaused(true);
    return () => setIsGloballyPaused(false);
  }, [setIsGloballyPaused, id]);

  // if (!postDetail) {
  //   router.push("/");
  // }

  const handleClose = () => {
    router.back();
  };

  const user = getCurrentUser();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
      >
        <PostModal
          isOpen={true}
          onClose={handleClose}
          post={postDetail}
          currentUser={user}
        />
      </motion.div>
    </AnimatePresence>
  );
}
