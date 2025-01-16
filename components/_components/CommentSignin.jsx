/* eslint-disable react/prop-types */
import { useState } from "react";
import usercom from "../../assets/usercom.png"; // Default profile picture
import likereply from "../../assets/icons/likereply.png";
import reply from "../../assets/icons/reply.png";
import TimeFormatter from "../../components/TimeFormatter";

const CommentSignin = ({ user, body, replies, createdAt, profilePic }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(replies ? replies.length : 0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");


  const handleLike = () => {
    setLikeCount(likeCount + 1);
  };

  const handleReply = () => {
    setIsReplying(!isReplying);
  };

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handlePostReply = () => {
    if (replyText.trim() !== "") {
      setReplyCount(replyCount + 1);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const formatTime = (date) => {
    return TimeFormatter(new Date(date));
  };

  return (
    <div className="p-4 bg-gray-50 mb-3">
      <div className="flex items-center mb-2">
        <img
          src={user?.profile?.avatar}
          alt={user?.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="w-full bg-white">
          <span className="font-bold mr-2">{user?.username}</span>
          <span className="flex justify-end text-xs text-gray-500">
            {formatTime(createdAt)}
          </span>
        </div>
      </div>
      <p className="mb-3 bg-white">{body}</p>
      <div className="mt-2 flex items-center justify-end space-x-4">
        <button
          className="flex items-center text-blue-500"
          onClick={handleLike}
        >
          <img src={likereply} alt="Like" className="w-4 h-4" />
          <span className="ml-1">{likeCount}</span>
        </button>
        <button
          className="flex items-center text-blue-500"
          onClick={handleReply}
        >
          <img src={reply} alt="Reply" className="w-4 h-4" />
          <span className="ml-1">{replyCount}</span>
        </button>
      </div>
      {/* {isReplying && (
        <div className="mt-4">
          <input
            type="text"
            value={replyText}
            onChange={handleReplyChange}
            placeholder="Add a reply"
            className="w-full h-12 bg-gray-100 rounded-full py-2 px-4 outline-none"
          />
          <button
            className="bg-purple-900 text-white py-2 px-4 rounded-full mt-2"
            onClick={handlePostReply}
          >
            Post Reply
          </button>
        </div>
      )}
      {replies && replies.length > 0 && (
        <div className="ml-4">
          {replies.map((reply, index) => (
            <CommentSignin key={index} {...reply} profilePic={profilePic} />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default CommentSignin;
