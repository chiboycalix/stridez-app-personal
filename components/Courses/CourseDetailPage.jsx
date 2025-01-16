import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Providers/AuthProvider";
import Loading from "../ui/Loading";
import Cookies from "js-cookie";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const baseUrl = process.env.REACT_APP_BASEURL;
  const { getCurrentUser } = useAuth();
  const userId = getCurrentUser()?.id;

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    try {
      setCurrentTime(videoRef.current.currentTime);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleMuteVolume = (e) => {
    const mutedVol = (videoRef.current.volume = 0);
    setVolume(mutedVol);
  };

  const handleUnmuteVolume = (e) => {
    const unmutedVol = (videoRef.current.volume = 1);
    setVolume(unmutedVol);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const showControls = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setDuration(videoRef.current.duration);
    }
  }, [videoRef]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/users/${userId}/courses/${id}/details?page=1&&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await res.json();
      const coursesMedia = data?.data?.courses?.media || [];
      setCourseData({ ...data?.data?.courses, videos: coursesMedia });
    } catch (err) {
      setError("Failed to fetch course data");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[85vh] bg-white">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[85vh] bg-white text-indigo-500">
        {error}
      </div>
    );
  }

  if (!courseData || courseData.videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[85vh] bg-white">
        No course data available
      </div>
    );
  }

  const currentVideo = courseData.videos[currentVideoIndex];

  return (
    <div className="flex flex-col xl:flex-row gap-3 p-2 bg-white min-h-[85vh]">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3 mt-1">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Library
          </button>
        </div>
        <div className="mb-6">
          <div
            className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer"
            onMouseMove={showControls}
            onMouseLeave={() => setControlsVisible(false)}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src={currentVideo.url}
              autoPlay
              poster={currentVideo.thumbnail || ""}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current.duration)}
              onEnded={() => setCurrentTime(0)}
            />
            <AnimatePresence>
              {(controlsVisible || !isPlaying) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
                >
                  <div className="flex items-center justify-between text-white mb-2">
                    <button
                      onClick={togglePlay}
                      className="text-white focus:outline-none"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </button>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setVolume(
                              volume > 0 ? handleMuteVolume : handleUnmuteVolume
                            );
                          }}
                          className="text-white focus:outline-none"
                        >
                          {volume > 0 ? (
                            <Volume2 className="h-6 w-6" />
                          ) : (
                            <VolumeX className="h-6 w-6" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 accent-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <button
                        onClick={toggleFullscreen}
                        className="text-white focus:outline-none"
                      >
                        <Maximize className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex justify-between text-white text-sm mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">{courseData.title}</h1>
        <p className="text-gray-600 mt-2">{courseData.description}</p>
      </div>
      <div className="md:w-96">
        <div className="space-y-2 my-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {courseData.videos.map((video, index) => (
            <motion.div
              key={video.id}
              className={`flex items-start space-x-2 cursor-pointer p-2 rounded-md ${
                index === currentVideoIndex ? "bg-gray" : ""
              }`}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentVideoIndex(index)}
            >
              <img
                src={video.url || ""}
                alt={video.title}
                className="w-40 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatTime(videoRef?.current?.duration)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <h2 className="text-lg font-semibold mb-3">Related Videos</h2>
        <div className="space-y-4">
          {["Introduction to Cooking", "Advanced Culinary Skills"].map(
            (title, idx) => (
              <motion.div
                key={idx}
                className="flex items-start space-x-2 cursor-pointer"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={`https://via.placeholder.com/150?text=${title.replace(
                    / /g,
                    "+"
                  )}`}
                  alt={title}
                  className="w-40 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">8 videos</p>
                </div>
                <ChevronRight className="text-gray-400 self-center" />
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
