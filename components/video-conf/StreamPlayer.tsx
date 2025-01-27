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

  useEffect(() => {
    const initVideo = async () => {
      if (!videoTrack || !containerRef.current) return;

      try {
        // Clear container
        containerRef.current.innerHTML = '';

        // Play video track
        await videoTrack.play(containerRef.current, {
          fit: isScreenShare ? 'contain' : 'cover',
          mirror: isLocalUser && !isScreenShare,
          ...options
        });
      } catch (error) {
        console.error('[STREAM-PLAYER] Error playing video:', error);
      }
    };

    initVideo();

    return () => {
      if (videoTrack && containerRef.current) {
        try {
          videoTrack.stop();
          containerRef.current.innerHTML = '';
        } catch (error) {
          console.error('[STREAM-PLAYER] Cleanup error:', error);
        }
      }
    };
  }, [videoTrack, isLocalUser, isScreenShare, options]);

  const shouldShowVideo = videoTrack && (isScreenShare || !isLocalUser || (isLocalUser && isCameraEnabled));

  return (
    <div className="relative w-full h-full bg-gray-900">
      {shouldShowVideo ? (
        <div ref={containerRef} className="w-full h-full" />
      ) : (
        <VideoMutedDisplay participant={{ uid, name: '', isLocal: isLocalUser }} />
      )}
    </div>
  );
};