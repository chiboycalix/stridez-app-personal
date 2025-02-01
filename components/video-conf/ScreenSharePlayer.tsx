import React, { useEffect, useRef } from "react";
import {
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
// import VideoMutedDisplay from "./VideoMutedDisplay";

type StreamPlayerProps = {
  audioTrack: (ILocalAudioTrack & IMicrophoneAudioTrack) | null;
  videoTrack: (ICameraVideoTrack & ILocalVideoTrack) | IRemoteVideoTrack | null;
  uid?: string | number;
  options?: object;
  isScreenShare?: boolean;
};

export const ScreenSharePlayer: React.FC<StreamPlayerProps> = ({
  // audioTrack,
  videoTrack,
  uid = "",
  options = {},
}) => {
  const containerRef = useRef<HTMLVideoElement>(null);
  // const { meetingConfig } = useVideoConferencing();

  // Clean up previous video track
  // useEffect(() => {
  //   return () => {
  //     if (videoTrack) {
  //       try {
  //         videoTrack.stop();
  //       } catch (error) {
  //         console.error(
  //           "[STREAM-PLAYER] Error cleaning up video track:",
  //           error
  //         );
  //       }
  //     }
  //   };
  // }, [videoTrack, uid]);

  // Initialize or update video track
  useEffect(() => {
    const initVideo = async () => {
      if (!videoTrack || !containerRef?.current) return;

      try {
        // Clear existing content
        while (containerRef?.current?.firstChild) {
          containerRef?.current.removeChild(containerRef.current.firstChild);
        }

        // Play new track
        videoTrack?.play(containerRef.current, {
          fit: videoTrack ? "contain" : "cover",
          ...options,
        });
      } catch (error) {
        console.error("[STREAM-PLAYER] Error playing video:", error);
      }
    };

    initVideo();
  }, [videoTrack, options, uid]);

  return (
    containerRef && videoTrack && (
      <div className="relative w-full h-full">
        <video
          ref={containerRef}
          // src={videoTrack as any}
          autoPlay
          controls={false}
          className={`w-full h-full`}
          playsInline
        >
          <source src={videoTrack as any} />
        </video>
      </div>
    )
  );
};
