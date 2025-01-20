import React, { useMemo } from 'react';
import VideoMutedDisplay from './VideoMutedDisplay';
import { Hand, Mic, MicOff } from 'lucide-react';
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import { StreamPlayer } from './StreamPlayer';

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
  const count = participants.length;

  if (count === 1) {
    return (
      <div className="h-full w-full flex items-center justify-center p-2 sm:p-4">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <ParticipantVideo participant={participants[0]} />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="h-full w-full flex items-center justify-center p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          {participants.map((participant: any) => (
            <div key={participant.uid} className="w-full sm:w-1/2 h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
              <ParticipantVideo participant={participant} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2 sm:p-4">
      <div className="sm:hidden h-full overflow-y-auto">
        <div className="flex flex-col gap-2">
          {participants.map((participant: any) => (
            <div key={participant.uid} className="w-full h-[250px] flex-shrink-0">
              <ParticipantVideo participant={participant} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block h-full">
        <div className={`h-full ${count > 6 ? 'overflow-y-auto' : ''}`}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {participants.map((participant: any) => (
              <div key={participant.uid}>
                <ParticipantVideo participant={participant} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScreenShareView({ remoteParticipants }: any) {
  const { screenTrack, screenSharingUser } = useVideoConferencing();

  if (!screenSharingUser) return null;

  if (screenSharingUser.isLocal) {
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
  if (!sharingParticipant) return null;

  return (
    <div className="w-full lg:basis-9/12 min-h-[300px] sm:min-h-[400px] bg-black">
      <div className="relative h-full w-full">
        <StreamPlayer
          videoTrack={sharingParticipant.screenVideoTrack}
          audioTrack={sharingParticipant.screenAudioTrack}
          isScreenShare={true}
        />
        <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
          {sharingParticipant.isLocal ? 'Your' : `${sharingParticipant.name}'s`} screen
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
    meetingConfig,
    hasJoinedMeeting,
    waitingParticipants
  } = useVideoConferencing();

  const { participants } = useMemo(() => {
    const validRemoteParticipants = Object.entries(remoteParticipants || {})
      .map(([uid, user]: any) => {
        // Skip if this user is in waiting room
        if (waitingParticipants[uid]) {
          return null;
        }

        if (uid === String(meetingConfig?.uid)) {
          return null;
        }

        // Skip users without proper initialization
        if (!user.rtcUid || user.name === "Anonymous") {
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
  }, [
    localUser,
    remoteParticipants,
    userIsHost,
    meetingRoomData,
    meetingConfig?.uid,
    waitingParticipants // Add to dependencies
  ]);

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
      <RegularGrid participants={participants} />
    </div>
  );
}