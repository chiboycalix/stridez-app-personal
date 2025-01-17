import React, { useState, useRef, useEffect, MutableRefObject } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import GallerySlider from './GallerySlider'
import { PostMediaType, usePost } from '@/context/PostContext'
import { useVideoPlayback } from '@/context/VideoPlaybackContext'
import Cookies from "js-cookie";
import { baseUrl } from '@/utils/constant'

type MediaWrapperProps = {
  title: string
  size?: string
  postMedia?: PostMediaType[]
  postId?: number
  media?: string
  mediaClass?: string
}

const MediaWrapper: React.FC<MediaWrapperProps> = ({
  title,
  size,
  postMedia,
  postId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { updateViewsCount } = usePost()
  const { isGloballyPaused, setIsGloballyPaused } = useVideoPlayback()

  const isImage =
    (postMedia &&
      /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(postMedia[0]?.url || '')) ||
    (postMedia && postMedia[0]?.mimeType === 'image/*')

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const progress =
          (videoRef.current.currentTime / videoRef.current.duration) * 100
        setProgress(progress)
      }
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('timeupdate', updateProgress)
    }

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', updateProgress)
      }
    }
  }, [])

  useEffect(() => {
    if (isImage) return

    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isGloballyPaused) {
            if (!hasBeenViewed && postId) {
              updateViewsCount(postId, (count: number) => count + 1)
              setHasBeenViewed(true)

              if (postMedia) {
                fetch(
                  `${baseUrl}/media/${postMedia[0].id}/view`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${Cookies.get(
                        'accessToken'
                      )}`,
                    },
                    body: JSON.stringify({ mediaTimestamp: 1 }),
                  }
                ).catch(error =>
                  console.log('Error updating view count:', error)
                )
              }
            }

            video
              .play()
              .catch(error => console.log('Autoplay prevented:', error))
            setIsPlaying(true)
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video)

    // Page Visibility API
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause()
        setIsPlaying(false)
        setIsGloballyPaused(true)
      } else {
        setIsGloballyPaused(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (video) observer.unobserve(video)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    isImage,
    hasBeenViewed,
    postId,
    updateViewsCount,
    postMedia,
    isGloballyPaused,
    setIsGloballyPaused,
  ])

  // Effect to handle global pause state
  useEffect(() => {
    if (isGloballyPaused && isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
    }
  }, [isGloballyPaused, isPlaying])

  return (
    <div className={`${size} relative overflow-hidden flex items-center`}>
      {isImage ? (
        <GallerySlider
          galleryImgs={postMedia}
          className="w-full h-full object-cover"
          imageClass="h-full"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={postMedia?.[0]?.url || ''}
            className="w-full h-full object-cover"
            loop
            playsInline
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ opacity: isPlaying ? 0 : 1 }}
            onClick={togglePlay}
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
        </>
      )}
    </div>
  )
}

export default MediaWrapper
