import React, { useCallback, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaBookmark, FaEye, FaHeart, FaRegCommentDots } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import PostComments from "./PostComments";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";
import VideoMedia from "./ModalMedia";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import Cookies from "js-cookie";
import { PostType } from "@/context/PostContext";
// import { PostType } from "@/context/PostContext";

// type PostType = {
//   id: number;
//   title: string;
//   body: string;
//   avatar: string;
//   firstName: string;
//   lastName: string;
//   metadata: {
//     likesCount: number;
//     commentsCount: number;
//     archiveCount: number;
//   };
//   mediaResource: {
//     id: number;
//     mimeType: string;
//     metadata: {
//       viewsCount: number;
//     };
//   }[];
//   thumbnailUrl: string;
//   userId: number;
// }

type PostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: PostType;
  currentUser: any;
};

const PostModal = ({ isOpen, onClose, post, currentUser }: PostModalProps) => {
  const [commentBody, setCommentBody] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);
  const { setIsGloballyPaused } = useVideoPlayback();

  const baseUrl = process.env.NEXT_PUBLIC_BASEURL;
  const postSocial = [
    {
      icon: <FaHeart />,
      value: post?.metadata?.likesCount,
      alt: "likes",
    },
    {
      icon: <FaRegCommentDots />,
      value: post?.metadata?.commentsCount,
      alt: "comments",
    },
    // {
    //   icon: <FaBookmark />,
    //   value: post?.metadata?.archiveCount,
    //   alt: "pinned",
    // },
    post &&
      post?.mediaResource?.[0]?.mimeType === "video" && {
        icon: <FaEye />,
        value: post?.mediaResource?.[0]?.metadata?.viewsCount || 0,
        alt: "views",
      },
  ].filter(Boolean);

  const handleFetchPostComments = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/posts/${Number(post?.id)}/comments?page=1&&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setPostComments(data?.data?.comments);
    } catch (error) {
      console.error("Error fetching post comments:", error);
    }
  }, [baseUrl, post?.id]);

  const handleCreateComment = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/posts/${post?.id}/create-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({ postId: post?.id, body: commentBody }),
        }
      );
      if (!response.ok) throw new Error("Error creating comment");
      setCommentBody("");
      handleFetchPostComments();
    } catch (error) {
      console.log("Error creating comment:", error);
    }
  }, [baseUrl, post?.id, commentBody, handleFetchPostComments]);

  const handleDeletePost = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/posts/${post?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Error deleting post");
      console.log("Post deleted successfully");
      onClose();
    } catch (error) {
      console.log("Error deleting post:", error);
    }
  }, [baseUrl, post?.id, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsGloballyPaused(true);
      setIsModalVideoPlaying(true);
    } else {
      setIsModalVideoPlaying(false);
    }
    return () => {
      setIsGloballyPaused(false);
      setIsModalVideoPlaying(false);
    };
  }, [isOpen, setIsGloballyPaused]);

  useEffect(() => {
    if (isOpen) {
      handleFetchPostComments();
    }
  }, [isOpen, handleFetchPostComments, post]);

  const handleModalClose = () => {
    onClose();
  };

  const handleSetViewOpen = () => {
    setIsViewModalOpen(true);
  };

  const PromptModal = () => {
    return (
      <Transition show={isViewModalOpen} as={React.Fragment}>
        <Dialog
          onClick={(e) => e.stopPropagation()}
          onClose={() => setIsViewModalOpen(false)}
          className="fixed inset-0 z-50 "
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            </TransitionChild>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete Post
                </DialogTitle>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={() => {
                      handleDeletePost();
                      setIsViewModalOpen(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="fixed inset-0 z-30 overflow-y-auto bg-black bg-opacity-50"
          onClick={handleModalClose}
        >
          <div className="min-h-screen px-4 text-center">
            <span
              className="inline-block lg:h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="inline-block w-fit p-2 my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <div className="flex flex-wrap flex-col md:flex-row">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full md:w-fit min-w-[25rem] bg-gray-100 max-w-[40rem]"
                >
                  <VideoMedia
                    title={post?.title}
                    size="w-fit min-w-[25rem] bg-gray-100 max-w-[40rem] max-h-[20rem] h-full md:min-h-[84vh] max-h-[84vh] rounded-lg object-cover"
                    media={post?.thumbnailUrl || ""}
                    postMedia={post?.mediaResource}
                    postId={post?.id}
                  />
                </motion.div>

                <div className="w-full md:w-[30rem] flex">
                  <div className="w-full flex flex-col">
                    <div className="p-4 border-b">
                      <div className="flex items-center">
                        <Image
                          src={post?.avatar}
                          alt={post?.firstName}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="ml-3 font-semibold">{`${post?.firstName} ${post?.lastName}`}</span>
                      </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4">
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4"
                      >
                        {post?.body}
                      </motion.p>
                      <div className="flex flex-col gap-3">
                        <h3>Comments</h3>
                        <ul className="flex flex-col gap-2">
                          <PostComments
                            comments={postComments}
                            postId={post?.id}
                          />
                        </ul>
                      </div>
                    </div>
                    <div className="pl-3 py-3 flex w-full items-center">
                      <Image
                        src={currentUser?.profile?.avatar}
                        alt={currentUser?.profile?.firstName}
                        width={40}
                        height={40}
                        className="rounded-full aspect-square w-11 h-11 mr-2 border-2 border-primary p-0.5"
                      />
                      <div className="relative px-1 hidden md:flex items-center justify-end bg-[#F8F8FC] border border-[#F8FEFF] rounded-full w-full">
                        <input
                          type="text"
                          className="w-full my-1 bg-transparent placeholder-[#838383] text-sm focus:outline-none"
                          placeholder="Add a comment"
                          onChange={(e) => setCommentBody(e.target.value)}
                          value={commentBody}
                        />
                        <motion.button
                          onClick={handleCreateComment}
                          whileHover={{ scale: 1.075 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={!commentBody}
                          className="px-6 py-2 text-sm flex rounded-full items-center text-white bg-primary hover:bg-primary/90"
                        >
                          Post
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-12 py-1 h-full flex flex-col justify-between items-center">
                    <Menu as="div" className="relative inline-block text-left">
                      {/* <MenuButton> */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="py-3.5 px-2.5 bg-gray-300 text-lg text-white rounded-full mb-px"
                      >
                        <PiDotsThreeOutlineVerticalFill />
                      </motion.button>
                      {/* </MenuButton> */}
                      <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="px-1 py-1">
                          {[
                            "Share Post",
                            currentUser?.id === post?.userId && "Edit Post",
                            currentUser?.id === post?.userId && "Delete Post",
                          ]
                            .filter(Boolean)
                            .map((option, index) => (
                              <MenuItem key={index}>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-gray-200 text-gray-900"
                                        : "text-gray-700"
                                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    onClick={
                                      option === "Delete Post"
                                        ? () => {
                                            handleSetViewOpen();
                                          }
                                        : undefined
                                    }
                                  >
                                    {option}
                                  </button>
                                )}
                              </MenuItem>
                            ))}
                        </div>
                      </MenuItems>
                    </Menu>

                    <div className="">
                      {postSocial?.map((menu, index) => (
                        <div
                          className="flex flex-col items-center text-xs mb-2.5 cursor-pointer"
                          key={index}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2.5 bg-gray-300 text-lg text-white rounded-full mb-px"
                          >
                            {menu && menu.icon}
                          </motion.button>
                          {menu && menu.value}
                        </div>
                      ))}
                    </div>
                    <div className="" />
                  </div>
                </div>
              </div>
            </motion.div>

            {isViewModalOpen && <PromptModal />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
