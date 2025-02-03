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

type ScreenPlayerProps = {
  audioTrack: (ILocalAudioTrack & IMicrophoneAudioTrack) | null;
  videoTrack: (ICameraVideoTrack & ILocalVideoTrack) | IRemoteVideoTrack | null;
  uid?: string | number;
  options?: object;
  isScreenShare?: boolean;
};

export const ScreenPlayer: React.FC<ScreenPlayerProps> = ({
  audioTrack,
  videoTrack,
  uid = "",
  options = {},
  isScreenShare = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isCameraEnabled, meetingConfig } = useVideoConferencing();

  // Clean up previous video track
  useEffect(() => {
    return () => {
      if (videoTrack) {
        try {
          videoTrack.stop();
          console.log('[STREAM-PLAYER] Video track stopped');
        } catch (error) {
          console.error('[STREAM-PLAYER] Error cleaning up video track:', error);
        }
      }
    };
  }, [videoTrack, uid]);

  // Initialize or update video track
  useEffect(() => {
    const initVideo = async () => {
      if (!videoTrack || !containerRef.current) {
        console.log('[STREAM-PLAYER] Video track or containerRef is null');
        return;
      }

      const shouldPlay = isScreenShare;
      console.log('[STREAM-PLAYER] isScreenShare:', isScreenShare);
      if (!shouldPlay) {
        console.log('[STREAM-PLAYER] Not playing video as isScreenShare is false');
        return;
      }

      try {
        // Clear existing content
        console.log('[STREAM-PLAYER] Clearing existing video content');
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // Log before playing video
        console.log('[STREAM-PLAYER] Playing new video track:', videoTrack);
        // Play new track
        videoTrack.play(containerRef.current, {
          fit: isScreenShare ? 'contain' : 'cover',
          ...options
        });
        videoTrack.play(containerRef.current)
        console.log('[STREAM-PLAYER] Video should be playing now');
      } catch (error) {
        console.error('[STREAM-PLAYER] Error playing video:', error);
      }
    };

    initVideo();
  }, [videoTrack]);

  // Log containerRef and videoTrack state
  console.log("ContainerRef:", containerRef.current);
  console.log("VideoTrack:", videoTrack);
  console.log("isScreenShare check share:", isScreenShare);

  return (
    <div className="relative w-full h-full">
      {isScreenShare ? (
        <>
          <div
            ref={containerRef}
            className={`w-[40rem] h-[40rem] }`}
          />
        </>
      ) : (
        <VideoMutedDisplay participant={{ uid, name: '', }} />
      )}
    </div>
  );
};
