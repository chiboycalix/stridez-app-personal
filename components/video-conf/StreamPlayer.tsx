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
  isScreenShare = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isCameraEnabled, meetingConfig } = useVideoConferencing();
  const isLocalUser = uid === meetingConfig?.uid;

  useEffect(() => {
    return () => {
      if (videoTrack) {
        try {
          videoTrack.stop();
        } catch (error) {
          console.error("[STREAM-PLAYER] Error cleaning up video track:", error);
        }
      }
    };
  }, [videoTrack, uid]);

  useEffect(() => {
    if (!videoTrack || !videoRef.current) return;

    videoTrack.play(videoRef.current);
  }, [videoTrack]); // ✅ Runs only when videoTrack changes

  const shouldShowVideo = isScreenShare
    ? !!videoTrack
    : videoTrack && (!isLocalUser || (isLocalUser && isCameraEnabled));

  return (
    <div className="relative w-full h-full">

      {/* <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`w-full h-full transition-opacity duration-300 ${shouldShowVideo ? "opacity-100" : "opacity-0"
          }`}
      />
      {!shouldShowVideo && (
        <VideoMutedDisplay participant={{ uid, name: "", isLocal: isLocalUser }} />
      )} */}
      {shouldShowVideo ? (
        <video
          playsInline autoPlay muted
          ref={videoRef}
          className={`w-full h-full transition-opacity duration-300 ${isScreenShare ? 'bg-black' : ''} ${shouldShowVideo ? "opacity-100" : "opacity-0"
            }`}
        />
      ) : (
        <VideoMutedDisplay participant={{ uid, name: '', isLocal: isLocalUser }} />
      )}
    </div>
  );
};
