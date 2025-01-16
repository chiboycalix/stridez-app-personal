import React, { useRef, useState, useEffect, useCallback } from "react";
import "../../styles/Post.css";
import Spinner from "../../components/Spinner";

const MediaWrapper = ({ media, title, mediaClass }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(media);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch((error) => console.log("Play error:", error));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleForward = useCallback(() => {
    const video = videoRef.current;
    if (video) video.currentTime += 10;
  }, []);

  const handleBackward = useCallback(() => {
    const video = videoRef.current;
    if (video) video.currentTime -= 10;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const currentTime = video.currentTime;
      const duration = video.duration || 1;
      setProgress((currentTime / duration) * 100);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .catch((error) => console.log("Autoplay prevented:", error));
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);

  const handleMouseEnter = useCallback(() => setShowControls(true), []);
  const handleMouseLeave = useCallback(() => setShowControls(false), []);

  const handleWaiting = useCallback(() => setIsLoading(true), []);
  const handlePlaying = useCallback(() => setIsLoading(false), []);
  const handleError = useCallback(() => {
    setIsLoading(false);
    console.log("Error loading video");
  }, []);

  return (
    <div className="min-h-[36rem] max-h-[40rem] w-[24rem] bg-black rounded-lg relative overflow-hidden">
      {isImage ? (
        <div className="relative h-auto min-h-[36rem] max-h-[40rem] w-full bg-black rounded-lg pt-full overflow-hidden">
          <img
            src={media}
            alt={title || "Image"}
            className="media-content small w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      ) : (
        <div
          className="media-content flex relative h-auto min-h-[39rem] max-h-[46rem] w-full bg-black rounded-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Spinner />
            </div>
          )}
          <video
            ref={videoRef}
            src={media.url}
            className={`w-full h-auto rounded ${mediaClass}`}
            onTimeUpdate={handleTimeUpdate}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onError={handleError}
            autoPlay
            muted={!isPlaying}
            onClick={handlePlayPause}
            loading="lazy"
            controls={false}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " ") handlePlayPause();
              if (e.key === "ArrowRight") handleForward();
              if (e.key === "ArrowLeft") handleBackward();
            }}
          />
          {showControls && (
            <VideoControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onForward={handleForward}
              onBackward={handleBackward}
              progress={progress}
            />
          )}
        </div>
      )}
    </div>
  );
};

const VideoControls = ({
  isPlaying,
  onPlayPause,
  onForward,
  onBackward,
  progress,
}) => (
  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center py-2 flex-col mb-2 bg-opacity-70 bg-gray-900 transition-opacity duration-300">
    <div className="flex gap-x-4">
      <button
        onClick={onBackward}
        className="bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-40 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-6-6m0 0l6-6m-6 6h18"
          />
        </svg>
      </button>
      <button
        onClick={onPlayPause}
        className="bg-white text-gray-800 rounded-full p-3 hover:bg-gray-300 transition duration-300"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-6.505-3.752A1 1 0 007 8.305v7.39a1 1 0 001.247.936l6.505-3.752a1 1 0 000-1.736z"
            />
          </svg>
        )}
      </button>
      <button
        onClick={onForward}
        className="bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-40 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 8l6 6m0 0l-6 6m6-6H3"
          />
        </svg>
      </button>
    </div>
    <div className="relative w-full h-1 bg-gray-800 mt-2 rounded overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default MediaWrapper;
