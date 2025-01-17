import React, { useEffect, useRef } from "react";
import {
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import VideoMutedDisplay from "./VideoMutedDisplay";

type StreamPlayerProps = {
  audioTrack: (ILocalAudioTrack & IMicrophoneAudioTrack) | null;
  videoTrack: (ICameraVideoTrack & ILocalVideoTrack) | IRemoteVideoTrack | null;
  uid?: string | number;
  options?: object;
  isScreenShare?: boolean;
};

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  audioTrack,
  videoTrack,
  uid = "",
  options = {},
  isScreenShare = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoTrackRef = useRef(videoTrack);
  const playingStateRef = useRef<boolean>(false);
  const { isCameraEnabled, meetingConfig } = useVideoConferencing();
  const isLocalUser = uid === meetingConfig?.uid;

  // Track cleanup function
  const cleanupVideoTrack = () => {
    if (videoTrackRef.current && playingStateRef.current) {
      try {
        videoTrackRef.current.stop();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        playingStateRef.current = false;
      } catch (error) {
        console.log('Error cleaning up video:', error);
      }
    }
  };

  // Initialize or update video playback
  const initializeVideo = async () => {
    const currentContainer = containerRef.current;
    if (!videoTrack || !currentContainer) return;

    const shouldPlay = isScreenShare || (isLocalUser && isCameraEnabled) || !isLocalUser;

    try {
      // If we need to play and aren't already playing
      if (shouldPlay && !playingStateRef.current) {
        // Clean up any existing playback first
        cleanupVideoTrack();

        // Initialize new playback
        if (currentContainer.childNodes.length === 0) {
          await videoTrack.play(currentContainer, {
            fit: isScreenShare ? 'contain' : 'cover',
            ...options
          });
          playingStateRef.current = true;
          videoTrackRef.current = videoTrack;
        }
      }
      // If we shouldn't play but are currently playing
      else if (!shouldPlay && playingStateRef.current) {
        cleanupVideoTrack();
      }
    } catch (error) {
      console.log(`Error managing video for uid ${uid}:`, error);
      playingStateRef.current = false;
    }
  };

  // Handle track changes
  useEffect(() => {
    if (videoTrack !== videoTrackRef.current) {
      cleanupVideoTrack();
      videoTrackRef.current = videoTrack;
      if (videoTrack) {
        initializeVideo();
      }
    }
  }, [videoTrack]);

  // Handle camera enabled state changes
  useEffect(() => {
    if (isLocalUser) {
      initializeVideo();
    }
  }, [isCameraEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupVideoTrack();
    };
  }, []);

  const shouldShowVideo = isScreenShare ?
    !!videoTrack :
    videoTrack && ((isLocalUser && isCameraEnabled) || !isLocalUser);

  return (
    <div className="relative w-full h-full">
      {shouldShowVideo ? (
        <div
          ref={containerRef}
          className={`w-full h-full ${isScreenShare ? 'bg-black' : ''}`}
        />
      ) : (
        <VideoMutedDisplay participant={{ uid, name: '', isLocal: isLocalUser }} />
      )}
    </div>
  );
};