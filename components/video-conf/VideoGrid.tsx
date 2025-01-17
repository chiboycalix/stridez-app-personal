import React, { useMemo } from 'react';
import VideoMutedDisplay from './VideoMutedDisplay';
import { Mic, MicOff } from 'lucide-react';
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import { StreamPlayer } from './StreamPlayer';

export function ParticipantVideo({ participant, customClasses = '' }: any) {
  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    speakingParticipants,
    meetingConfig
  } = useVideoConferencing();

  console.log('[PARTICIPANT-VIDEO] Rendering participant:', {
    uid: participant.uid,
    isLocal: participant.isLocal,
    hasVideoTrack: !!participant.videoTrack,
    hasAudioTrack: !!participant.audioTrack,
    videoEnabled: participant.videoEnabled,
    audioEnabled: participant.audioEnabled
  });

  // Enhanced video state logic
  const videoState = participant.isLocal ?
    (isCameraEnabled && !!participant.videoTrack) :
    (participant.videoEnabled !== false && !!participant.videoTrack);

  console.log('[PARTICIPANT-VIDEO] Video state calculation:', {
    uid: participant.uid,
    isLocal: participant.isLocal,
    videoState,
    isCameraEnabled,
    videoEnabled: participant.videoEnabled,
    hasTrack: !!participant.videoTrack
  });

  // Enhanced audio state logic
  const audioState = participant.isLocal ?
    (isMicrophoneEnabled && !!participant.audioTrack) :
    (participant.audioEnabled !== false && !!participant.audioTrack);

  const displayName = participant.isLocal ? 'You' : (participant.name || `User ${participant.uid}`);
  const isSpeaking = speakingParticipants[participant?.uid];

  return (
    <div
      className={`relative h-full w-full rounded-lg overflow-hidden ${customClasses} 
        ${isSpeaking ? 'border-2 border-green-500' : ''}`}
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

  if (count === 3) {
    return (
      <div className="h-full w-full flex items-center justify-center p-2 sm:p-4">
        <div className="flex flex-col gap-2 sm:gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {participants.slice(0, 2).map((participant: any) => (
              <div key={participant.uid} className="w-full sm:w-1/2 h-[200px] sm:h-[300px] md:h-[350px]">
                <ParticipantVideo participant={participant} />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="w-full sm:w-1/2 h-[200px] sm:h-[300px] md:h-[350px]">
              <ParticipantVideo participant={participants[2]} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="h-full w-full flex items-center justify-center p-2 sm:p-4">
        <div className="flex flex-col gap-2 sm:gap-4 w-full">
          {[0, 2].map((startIndex) => (
            <div key={startIndex} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {participants.slice(startIndex, startIndex + 2).map((participant: any) => (
                <div key={participant.uid} className="w-full sm:w-1/2 h-[200px] sm:h-[250px] md:h-[300px]">
                  <ParticipantVideo participant={participant} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {participants.map((participant: any) => (
          <div key={participant.uid} className="h-[200px] sm:h-[250px] md:h-[300px]">
            <ParticipantVideo participant={participant} />
          </div>
        ))}
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
  showControls = true,
}: any) {
  const {
    userIsHost,
    meetingRoomData,
    isSharingScreen,
    meetingConfig
  } = useVideoConferencing();

  const { participants } = useMemo(() => {
    console.log('[VIDEO-GRID] Mapping participants:', {
      localUser,
      remoteParticipants: Object.keys(remoteParticipants || {})
    });

    const validRemoteParticipants = Object.entries(remoteParticipants || {})
      .map(([uid, user]: any) => {
        // Ensure we're not including the local user in remote participants
        if (uid === String(meetingConfig?.uid)) {
          console.log('[VIDEO-GRID] Skipping local user from remote participants:', uid);
          return null;
        }

        const isHost = meetingRoomData?.room?.roomSubscribers?.some(
          (subscriber: any) => subscriber.isOwner && subscriber.user?.id === user.uid
        );

        console.log('[VIDEO-GRID] Processing remote participant:', {
          uid,
          hasVideoTrack: !!user.videoTrack,
          hasAudioTrack: !!user.audioTrack,
          videoEnabled: user.videoEnabled,
          audioEnabled: user.audioEnabled
        });

        return {
          ...user,
          uid,
          isHost,
          isLocal: false  // Explicitly mark as remote
        };
      })
      .filter(Boolean); // Remove null entries

    // Prepare local user with correct properties
    const preparedLocalUser = {
      ...localUser,
      uid: meetingConfig?.uid,
      isLocal: true,
      isHost: userIsHost,
      videoEnabled: localUser.videoEnabled ?? true,
      audioEnabled: localUser.audioEnabled ?? true
    };

    console.log('[VIDEO-GRID] Final participants:', {
      localUser: preparedLocalUser,
      remoteCount: validRemoteParticipants.length
    });

    return {
      participants: [
        preparedLocalUser,
        ...validRemoteParticipants
      ].filter(p => p !== null && p !== undefined)
    };
  }, [localUser, remoteParticipants, userIsHost, meetingRoomData, meetingConfig?.uid]);

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