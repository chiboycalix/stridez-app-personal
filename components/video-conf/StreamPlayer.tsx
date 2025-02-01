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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isCameraEnabled, meetingConfig } = useVideoConferencing();
  const isLocalUser = uid === meetingConfig?.uid;

  // Clean up previous video track
  useEffect(() => {
    return () => {
      if (videoTrack) {
        try {
          videoTrack.stop();
        } catch (error) {
          console.error('[STREAM-PLAYER] Error cleaning up video track:', error);
        }
      }
    };
  }, [videoTrack, uid]);

  // Initialize or update video track
  useEffect(() => {
    const initVideo = async () => {
      if (!videoTrack || !videoRef.current) return;

      const shouldPlay = isScreenShare || !isLocalUser || (isLocalUser && isCameraEnabled);
      if (!shouldPlay) return;

      try {
        // Clear existing content
        while (videoRef.current.firstChild) {
          videoRef.current.removeChild(videoRef.current.firstChild);
        }

        // Play new track
        await videoTrack.play(videoRef.current, {
          fit: isScreenShare ? 'contain' : 'cover',
          ...options
        });

      } catch (error) {
        console.error('[STREAM-PLAYER] Error playing video:', error);
      }
    };

    initVideo();
  }, [videoTrack, isLocalUser, isCameraEnabled, isScreenShare, options, uid]);

  const shouldShowVideo = isScreenShare ?
    !!videoTrack :
    videoTrack && (!isLocalUser || (isLocalUser && isCameraEnabled));

  useEffect(() => {
    if (videoTrack && videoRef.current) {
      videoTrack.play(videoRef.current);
    }
  }, [videoTrack]);
  console.log({ isCameraEnabled })
  return (
    <div className="relative w-full h-full" style={{ visibility: "visible", width: "100%", height: "100%" }}>
      {shouldShowVideo ? (
        <video
          playsInline autoPlay muted
          ref={videoRef}
          className={`w-full h-full ${isScreenShare ? 'bg-black' : ''}`}
        />
      ) : (
        <VideoMutedDisplay participant={{ uid, name: '', isLocal: isLocalUser }} />
      )}
    </div>
  );
};