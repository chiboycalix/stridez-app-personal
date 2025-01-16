import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import GallerySlider from "./GallerySlider";
import { PostMediaType } from "@/context/PostContext";

type VideoMediaProps = {
  postMedia: PostMediaType[];
  size: string;
  title?: string;
  postId?: number;
  media: string;
};

export default function VideoMedia({ postMedia, size }: VideoMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isImage =
    postMedia &&
    postMedia.length > 0 &&
    /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(postMedia[0]?.url);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video?.currentTime / video?.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.log("Autoplay prevented:", error));
    }
  }, []);

  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        setIsPlaying(false);
      }
    };
  }, []);

  if (isImage) {
    return (
      <div className={`${size} relative overflow-hidden flex items-center`}>
        <GallerySlider
          galleryImgs={postMedia}
          className="w-full h-full object-cover"
          imageClass="h-full"
        />
      </div>
    );
  }

  return (
    <div className={`${size} relative overflow-hidden flex items-center`}>
      <video
        ref={videoRef}
        src={postMedia && postMedia.length > 0 ? postMedia[0]?.url : undefined}
        className="w-full h-full object-cover"
        loop
        playsInline
      />

      <div
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        style={{ opacity: isPlaying ? 0 : 1 }}
      >
        <button
          onClick={togglePlay}
          className="text-white text-6xl transform transition-transform duration-300 hover:scale-110"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
