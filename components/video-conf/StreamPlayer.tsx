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
  const { isCameraEnabled, meetingConfig } = useVideoConferencing();
  const isLocalUser = uid === meetingConfig?.uid;

  // Clean up previous video track
  useEffect(() => {
    return () => {
      if (videoTrack) {
        try {
          videoTrack.stop();
          console.log('[STREAM-PLAYER] Cleaned up video track for uid:', uid);
        } catch (error) {
          console.error('[STREAM-PLAYER] Error cleaning up video track:', error);
        }
      }
    };
  }, [videoTrack, uid]);

  // Initialize or update video track
  useEffect(() => {
    const initVideo = async () => {
      if (!videoTrack || !containerRef.current) return;

      const shouldPlay = isScreenShare || !isLocalUser || (isLocalUser && isCameraEnabled);
      if (!shouldPlay) return;

      try {
        // Clear existing content
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // Play new track
        await videoTrack.play(containerRef.current, {
          fit: isScreenShare ? 'contain' : 'cover',
          ...options
        });

        console.log('[STREAM-PLAYER] Successfully playing video for uid:', uid);
      } catch (error) {
        console.error('[STREAM-PLAYER] Error playing video:', error);
      }
    };

    initVideo();
  }, [videoTrack, isLocalUser, isCameraEnabled, isScreenShare, options, uid]);

  const shouldShowVideo = isScreenShare ?
    !!videoTrack :
    videoTrack && (!isLocalUser || (isLocalUser && isCameraEnabled));

  console.log('[STREAM-PLAYER] Render state:', {
    uid,
    shouldShowVideo,
    hasTrack: !!videoTrack,
    isLocalUser,
    cameraEnabled: isCameraEnabled
  });

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