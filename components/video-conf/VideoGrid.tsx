import React, { useEffect, useMemo, useState } from 'react';
import VideoMutedDisplay from './VideoMutedDisplay';
import { Hand, Mic, MicOff } from 'lucide-react';
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import { StreamPlayer } from './StreamPlayer';
import MobileView from './MobileView';
import DesktopView from './DesktopView';
import { ScreenSharePlayer } from './ScreenSharePlayer';

export function ParticipantVideo({ participant, customClasses = '' }: any) {
  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    speakingParticipants,
    meetingConfig,
    raisedHands,
  } = useVideoConferencing();

  const hasRaisedHand = raisedHands[participant.uid];
  const videoState = participant.isLocal ?
    (isCameraEnabled && !!participant.videoTrack) :
    (participant.videoEnabled !== false && !!participant.videoTrack);

  const audioState = participant.isLocal ?
    (isMicrophoneEnabled && !!participant.audioTrack) :
    (participant.audioEnabled !== false && !!participant.audioTrack);

  const displayName = participant.isLocal ? 'You' : (participant.name || `User ${participant.uid}`);
  const audioEnabled = participant.isLocal ?
    isMicrophoneEnabled :
    participant.audioEnabled;

  const isSpeaking = audioEnabled ?
    (participant.isLocal ?
      speakingParticipants[String(meetingConfig.uid)] :
      speakingParticipants[participant.uid]
    ) : false;

  return (
    <div
      className={`relative h-full w-full rounded-lg overflow-hidden ${customClasses} 
        ${isSpeaking ? 'border-2 border-primary-500' : ''}`}
    >
      {!videoState ? (
        <VideoMutedDisplay participant={participant} />
      ) : (
        <StreamPlayer
          videoTrack={participant.videoTrack}
          audioTrack={participant.audioTrack}
          uid={participant.uid}
        />
      )}

      <div className="absolute top-0 right-0 p-2 flex flex-col gap-2">
        <div className="bg-black/50 p-1.5 rounded-lg">
          {audioState ? (
            <Mic size={16} className="text-white" />
          ) : (
            <MicOff size={16} className="text-red-500" />
          )}
        </div>
      </div>

      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
        {displayName}
      </div>
      {hasRaisedHand && (
        <div className="absolute top-2 left-2 bg-primary-900 text-white p-1.5 rounded-lg z-10">
          <Hand size={16} />
        </div>
      )}
    </div>
  );
}

export function RegularGrid({ participants }: any) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleParticipants = isMobile ? participants.slice(0, 8) : participants;

  if (isMobile) {
    return <MobileView visibleParticipants={visibleParticipants} />
  } else {
    return <DesktopView participants={participants} />
  }
}

export function ScreenShareView({ remoteParticipants }: any) {
  const { screenTrack, screenSharingUser } = useVideoConferencing();
  console.log("remoteParticipants....sharing", remoteParticipants)

  if (!screenSharingUser) return null;

  if (screenSharingUser?.isLocal) {
    return (
      <div className="w-full lg:basis-9/12 min-h-[300px] sm:min-h-[400px] bg-black">
        <div className="relative h-full w-full">
          <StreamPlayer
            videoTrack={screenTrack?.screenVideoTrack}
            audioTrack={screenTrack?.screenAudioTrack}
            isScreenShare={true}
          />
        </div>
      </div>
    );
  }

  const sharingParticipant = remoteParticipants[screenSharingUser.uid];
  console.log("sharingParticipant....sharing",remoteParticipants, sharingParticipant)
  // if (!sharingParticipant) return null;

  return (
    <div className="w-full lg:basis-9/12 min-h-[300px] sm:min-h-[400px] bg-black">
      <div className="relative h-full w-full">
        <ScreenSharePlayer
          videoTrack={sharingParticipant?.videoTrack}
          audioTrack={sharingParticipant?.screenAudioTrack}
          isScreenShare={true}
        />
        <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
          {sharingParticipant?.isLocal ? 'Your' : `${sharingParticipant?.name}'s`} screen
        </div>
      </div>
    </div>
  );
}

export function ParticipantsColumn({ participants }: any) {
  return (
    <div className="w-full lg:basis-3/12 overflow-x-auto lg:overflow-y-auto">
      <div className="flex lg:flex-col gap-2 p-2 min-h-[150px] lg:h-full">
        <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
          {participants.map((participant: any) => (
            <div key={participant.uid}
              className="w-[200px] lg:w-full h-[150px] lg:h-40 flex-shrink-0">
              <ParticipantVideo participant={participant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export function VideoGrid({
  localUser,
  remoteParticipants,
}: any) {
  const {
    userIsHost,
    meetingRoomData,
    isSharingScreen,
    meetingConfig
  } = useVideoConferencing();
  const [orientation, setOrientation] = useState(window.innerWidth > window.innerHeight ? "landscape" : "portrait");

  const { participants } = useMemo(() => {

    const validRemoteParticipants = Object.entries(remoteParticipants || {})
      .map(([uid, user]: any) => {
        if (uid === String(meetingConfig?.uid)) {
          return null;
        }

        const isHost = meetingRoomData?.room?.roomSubscribers?.some(
          (subscriber: any) => subscriber.isOwner && subscriber.user?.id === user.uid
        );

        return {
          ...user,
          uid,
          isHost,
          isLocal: false
        };
      })
      .filter(Boolean);

    const preparedLocalUser = {
      ...localUser,
      uid: meetingConfig?.uid,
      isLocal: true,
      isHost: userIsHost,
      videoEnabled: localUser.videoEnabled ?? true,
      audioEnabled: localUser.audioEnabled ?? true
    };

    return {
      participants: [preparedLocalUser, ...validRemoteParticipants]
        .filter(p => p !== null && p !== undefined)
    };
  }, [localUser, remoteParticipants, userIsHost, meetingRoomData, meetingConfig?.uid]);

  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSharingScreen) {
    return (
      <div className="h-full w-full flex flex-col lg:flex-row gap-2">
        <ScreenShareView remoteParticipants={remoteParticipants} />
        <ParticipantsColumn participants={participants} />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <RegularGrid participants={participants} key={orientation} />
    </div>
  );
}
