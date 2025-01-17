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
  const playingStateRef = useRef<boolean>(false);
  const { isCameraEnabled, meetingConfig } = useVideoConferencing();
  const isLocalUser = uid === meetingConfig?.uid;

  useEffect(() => {
    let isMounted = true;
    const currentContainer = containerRef.current;

    const initializeVideo = async () => {
      if (!videoTrack || !currentContainer || !isMounted) return;

      const shouldPlay = isScreenShare || (isLocalUser && isCameraEnabled) || !isLocalUser;

      try {
        if (shouldPlay && !playingStateRef.current) {
          if (currentContainer.childNodes.length === 0) {
            await videoTrack.play(currentContainer, {
              fit: isScreenShare ? 'contain' : 'cover',
              ...options
            });
            if (isMounted) {
              playingStateRef.current = true;
            }
          }
        } else if (!shouldPlay && playingStateRef.current) {
          videoTrack.stop();
          if (currentContainer && isMounted) {
            currentContainer.innerHTML = '';
            playingStateRef.current = false;
          }
        }
      } catch (error) {
        console.log(`Error managing video for uid ${uid}:`, error);
        if (isMounted) {
          playingStateRef.current = false;
        }
      }
    };

    initializeVideo();

    return () => {
      isMounted = false;
      if (videoTrack && playingStateRef.current) {
        try {
          videoTrack.stop();
          if (currentContainer) {
            currentContainer.innerHTML = '';
          }
          playingStateRef.current = false;
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