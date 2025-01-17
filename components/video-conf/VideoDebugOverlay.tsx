import React, { useEffect } from 'react';
import { useVideoConferencing } from "@/context/VideoConferencingContext";

const VideoDebugOverlay = () => {
  const {
    remoteParticipants,
    localUserTrack,
    isCameraEnabled,
    isMicrophoneEnabled,
    meetingConfig,
    hasJoinedMeeting
  } = useVideoConferencing();

  useEffect(() => {
    console.log('[DEBUG] Remote Participants State:', {
      participants: Object.entries(remoteParticipants).map(([uid, participant]) => ({
        uid,
        hasVideoTrack: !!(participant as any).videoTrack,
        hasAudioTrack: !!(participant as any).audioTrack,
        videoEnabled: (participant as any).videoEnabled,
        audioEnabled: (participant as any).audioEnabled,
        name: (participant as any).name
      }))
    });
  }, [remoteParticipants]);

  useEffect(() => {
    console.log('[DEBUG] Local User State:', {
      hasVideoTrack: !!localUserTrack?.videoTrack,
      hasAudioTrack: !!localUserTrack?.audioTrack,
      isCameraEnabled,
      isMicrophoneEnabled,
      uid: meetingConfig?.uid,
      hasJoinedMeeting
    });
  }, [localUserTrack, isCameraEnabled, isMicrophoneEnabled, meetingConfig, hasJoinedMeeting]);

  return null;
};

export default VideoDebugOverlay;