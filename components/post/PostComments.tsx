"use client";

import React, { useState, useEffect, useCallback, memo, FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isValid, parseISO } from "date-fns";
import Image from "next/image";

const PostComments = memo(({ comments: initialComments, postId }: any) => {
  const [comments, setComments] = useState<[]>(initialComments);
  const [nestedComments, setNestedComments] = useState<NestedCommentsState>({});
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASEURL;

  type Comment = {
    id: number;
    createdAt?: string;
    _user?: {
      avatar?: string;
      username?: string;
    };
    body?: string;
  };

  type CommentComponentProps = {
    comment: Comment;
    isNested?: boolean;
  };

  type NestedCommentsState = {
    [key: string]: Comment[];
  };


  const fetchNestedComments = useCallback(
    async (commentId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${baseUrl}/posts/${postId}/comments/${commentId}?page=1&limit=10`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch nested comments");
        }
        const data = await response.json();
        console.log("nested", data?.data.comments);
        setNestedComments((prev) => ({
          ...prev,
          [commentId]: data?.data.comments,
        }));
        setExpandedComments((prev) => new Set(prev).add(commentId));
      } catch (error) {
        setError("Error fetching nested comments. Please try again.");
        console.log("Error fetching nested comments:", error);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, postId]
  );

  const toggleNestedComments = (e: React.MouseEvent<HTMLButtonElement>, commentId: number) => {
    e.preventDefault();
    if (expandedComments?.has(commentId)) {
      setExpandedComments((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    } else {
      fetchNestedComments(commentId);
    }
  };

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);


  const CommentComponent: FC<CommentComponentProps> = ({
    comment,
    isNested = false,
  }) => {
    const createdAt =
      comment.createdAt && isValid(parseISO(comment.createdAt))
        ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
        : "Unknown time";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start space-x-3 ${isNested ? "ml-8 mt-2" : "mb-4"
          }`}
      >
        <Image
          width={40}
          height={40}
          src={comment?._user?.avatar || "/placeholder.svg?height=40&width=40"}
          alt={comment?._user?.username || "Anonymous User"}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <p className="font-semibold text-sm">
              {comment?._user?.username || "Anonymous"}
            </p>
            <p className="text-sm">{comment?.body}</p>
          </div>
          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
            <span>{createdAt}</span>
            <button className="font-semibold hover:text-gray-700">Reply</button>
            <button className="font-semibold hover:text-gray-700">Like</button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {comments?.length > 0 &&
          comments?.map((comment: Comment) => (
            <motion.div key={comment.id} layout>
              <CommentComponent comment={comment} />
              {comment.id && (
                <button
                  onClick={(e) => toggleNestedComments(e, comment.id)}
                  className="ml-11 text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  {expandedComments?.has(comment.id) ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide replies
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      View replies
                    </>
                  )}
                </button>
              )}
              <AnimatePresence>
                {expandedComments.has(comment.id) &&
                  nestedComments[comment?.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {nestedComments[comment.id].map((nestedComment) => (
                        <CommentComponent
                          key={nestedComment.id}
                          comment={nestedComment}
                          isNested
                        />
                      ))}
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
          ))}
      </AnimatePresence>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {comments?.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">Be the first to comment</p>
      )}
    </div>
  );
});

PostComments.displayName = "PostComments";

export default PostComments;
