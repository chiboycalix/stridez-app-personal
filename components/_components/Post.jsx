import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Providers/AuthProvider";
import MediaWrapper from "./MediaWrapper";
import {
  FaHeart,
  FaRegComment,
  FaBookmark,
  FaEye,
  FaShareAlt,
  FaTwitter,
  FaShare,
} from "react-icons/fa"; 
import { AiOutlineLink } from "react-icons/ai";
import { SiWhatsapp, SiTelegram, SiFacebook } from "react-icons/si";
import "../../styles/Post.css"; 
import TimeFormatter from "../../components/TimeFormatter";
import { Popover } from "@headlessui/react";
import Cookies from "js-cookie"

const baseUrl = process.env.REACT_APP_BASEURL;

const Post = ({
  resource,
  media,
  title,
  profilepic,
  pin,
  views,
  likesCount = 0,
  commentsCount = 0,
  shares,
  className,
}) => {
  const [mediaClass, setMediaClass] = useState("media-content");
  const [shareOptions, setShareOptions] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { getAuth } = useAuth();

  const [likeCount, setLikeCount] = useState(likesCount);
  const [commentCount, setCommentCount] = useState(commentsCount);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();


  const handleSubscribe = () => {
    if (!getAuth()) return navigate("/");
    setIsFollowing(!isFollowing);
  };

  const handleLikeClick = async () => {
    if (!getAuth()) return navigate("/");

    try {
      const response = await fetch(
        `${baseUrl}/posts/${resource?.id}/toggle-like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setLikeCount(data.data.likesCount);
        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);

        const likedPosts = JSON.parse(Cookies.get("likedPosts")) || {};
        if (newLikedStatus) {
          likedPosts[resource.id] = true;
        } else {
          delete likedPosts[resource.id]; 
        }
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentClick = (e) => {
    // navigate(`/p/`, { state: { resource } });
    e.preventDefault();
    navigate(`/p/${resource.id}`, {
      state: { background: location },
    });
  };

  useEffect(() => {
    setCommentCount(commentsCount);

    // Load liked status from localStorage
    const likedPosts = JSON.parse(Cookies.get("likedPosts")) || {};
    setIsLiked(!!likedPosts[resource.id]); // Check if the post is liked in localStorage

    const img = new Image();
    img.src = media;
    img.onload = () => {
      setMediaClass(
        img.width > img.height ? "media-content large" : "media-content small"
      );
    };
  }, [media, commentsCount, resource.id]);

  const postSideMenu = [
    {
      icon: <FaHeart />,
      value: likeCount,
      alt: "likes",
      onClick: handleLikeClick,
      colorClass: isLiked ? "text-red-500" : "text-gray-700",
    },
    {
      icon: <FaRegComment />,
      value: commentCount,
      alt: "comments",
      onClick: handleCommentClick,
    },
    { icon: <FaBookmark />, value: pin, alt: "pinned" },
    { icon: <FaEye />, value: views, alt: "views" },
  ];

  const shareOptionsMenu = [
    { icon: <AiOutlineLink />, alt: "Copy link", text: "Copy link" },
    { icon: <SiWhatsapp />, alt: "WhatsApp", text: "Share to WhatsApp" },
    { icon: <SiTelegram />, alt: "Telegram", text: "Share to Telegram" },
    { icon: <SiFacebook />, alt: "Facebook", text: "Share to Facebook" },
    { icon: <FaTwitter />, alt: "Twitter", text: "Share to Twitter" },
  ];

  const formatTime = (date) => TimeFormatter(new Date(date));

  return (
    <div className="p-3">
      <div className={`py-3 rounded relative ${className} flex-col w-[28rem]`}>
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="flex items-center">
            <img
              src={resource?.avatar}
              alt={resource?.username}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <div className="text-gray-800">{resource?.username}</div>
              <div className="text-gray-500">
                {formatTime(resource?.createdAt)}
              </div>
            </div>
          </div>
          <button
            className={`bg-[#37169C] text-white px-4 py-2.5 text-sm rounded hover:bg-purple-700 ${
              isFollowing ? "Following" : "Follow"
            }`}
            onClick={handleSubscribe}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <div className="mb-1.5">
          <h3 className="text-lg font-semibold text-gray-700">
            {resource?.title}
          </h3>
          <p className="text-blue-500">{resource?.body}</p>
        </div>

        <div className="flex gap-3">
          <MediaWrapper
            title={resource?.title}
            media={resource?.thumbnailUrl}
            mediaClass={mediaClass}
          />
          <div className="flex justify-end flex-col items-center text-gray-700 font-medium text-xs">
            {postSideMenu.map((menu, index) => (
              <div
                className={`flex flex-col items-center mb-3 cursor-pointer ${menu.colorClass}`}
                key={index}
                onMouseEnter={menu.onMouseEnter}
                onMouseLeave={menu.onMouseLeave}
                onClick={menu.onClick}
              >
                <div className="p-1.5 shadow-md text-lg rounded-full mb-px">
                  {menu.icon}
                </div>
                {menu.value}
              </div>
            ))}
            {/* Share Options using HeadlessUI Popover */}
            <Popover className="relative w-full">
              <Popover.Button className="flex flex-col items-center w-full outline-none border-none">
                <div className="p-2 rounded-full shadow-md">
                  <FaShareAlt className="text-lg text-gray-700" />
                </div>
                <span>{shares}</span>
              </Popover.Button>

              <Popover.Panel className="absolute z-10 transition-all duration-500 ease-in-out bg-gray-50 shadow-md rounded px-2 py-2.5 mt-2 w-48">
                {shareOptionsMenu.map((option, i) => (
                  <button
                    type="button"
                    key={i}
                    className="flex items-center w-full space-x-2 hover:bg-gray-100 p-2 rounded"
                  >
                    {option.icon}
                    <span>{option.text}</span>
                  </button>
                ))}
              </Popover.Panel>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
