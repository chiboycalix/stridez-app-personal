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

type ScreenSharePlayerProps = {
  audioTrack: (ILocalAudioTrack & IMicrophoneAudioTrack) | null;
  videoTrack: (ICameraVideoTrack & ILocalVideoTrack) | IRemoteVideoTrack | null;
  uid?: string | number;
  options?: object;
  isScreenShare?: boolean;
};

export const ScreenSharePlayer: React.FC<ScreenSharePlayerProps> = ({
  audioTrack,
  videoTrack,
  uid = "",
  options = {},
  isScreenShare = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { rtcScreenShareOptions } = useVideoConferencing();
  const isLocalUser = uid === rtcScreenShareOptions?.uid;

  // Callback ref to ensure the video element is available before playing
  const setVideoRef = (node: HTMLVideoElement | null) => {
    if (node) {
      videoRef.current = node;
      if (videoTrack) {
        console.log("Playing video track after setting ref...");
        videoTrack.play(node);
      }
    }
  };

  useEffect(() => {
    console.log("videoTrack updated:", videoTrack);
    console.log("videoRef.current:", videoRef.current);

    if (videoTrack && videoRef.current) {
      console.log("Attempting to play videoTrack...");
      setTimeout(() => {
        videoTrack.play(videoRef.current as HTMLVideoElement);
      }, 100); // Small delay to avoid race conditions
    } else {
      console.log("videoTrack or videoRef.current is missing.");
    }
  }, [videoTrack]);

  return (
    <div className="relative w-full h-full">
      <video
        key={videoTrack?.getTrackId()} // Forces re-render when video track changes
        playsInline
        autoPlay
        muted
        ref={setVideoRef} // Uses callback ref to ensure video element is available
        className={`w-full h-full transition-opacity duration-300 ${!isScreenShare ? "bg-black" : ""}`}
      />
    </div>
  );
};
