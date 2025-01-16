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
  const videoRef = useRef<any>(null);
  const { isCameraEnabled, meetingConfig } = useVideoConferencing();
  const isLocalUser = uid === meetingConfig?.uid;

  useEffect(() => {
    videoRef.current = videoTrack;
    return () => {
      videoRef.current = null;
    };
  }, [videoTrack]);

  useEffect(() => {
    let isPlaying = false;
    const currentContainer = containerRef.current;

    const initializeVideo = async () => {
      if (!videoRef.current || !currentContainer) {
        return;
      }

      const shouldPlay = isScreenShare || (isLocalUser && isCameraEnabled) || !isLocalUser;

      try {
        if (shouldPlay && !isPlaying) {
          if (currentContainer.childNodes.length === 0) {
            await videoRef.current.play(currentContainer, {
              fit: isScreenShare ? 'contain' : 'cover',
              ...options
            });
            isPlaying = true;
          }
        } else if (!shouldPlay && isPlaying) {
          videoRef.current.stop();
          if (currentContainer) {
            currentContainer.innerHTML = '';
          }
          isPlaying = false;
        }
      } catch (error) {
        console.log(`Error managing video for uid ${uid}:`, error);
        isPlaying = false;
      }
    };

    initializeVideo();

    return () => {
      if (videoRef.current && isPlaying) {
        try {
          videoRef.current.stop();
          if (currentContainer) {
            currentContainer.innerHTML = '';
          }
        } catch (error) {
          console.log('Error cleaning up video:', error);
        }
      }
    };
  }, [videoTrack, uid, isCameraEnabled, isLocalUser, isScreenShare, options]);

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

export default StreamPlayer;