import React from 'react';
import VideoMutedDisplay from './VideoMutedDisplay';
import { Mic, MicOff } from 'lucide-react';
import { useVideoConferencing } from "@/context/VideoConferencingContext";

const VideoGrid = ({
  localUser,
  remoteParticipants,
  StreamPlayer,
  showControls = true,
}: any) => {
  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    speakingParticipants,
    userIsHost,
    meetingRoomData,
    isSharingScreen,
    screenTrack,
    screenSharingUser
  } = useVideoConferencing();

  const prepareParticipantsList = () => {
    const validRemoteParticipants = Object.entries(remoteParticipants || {})
      .map(([uid, user]: any) => {
        const isHost = meetingRoomData?.room?.roomSubscribers?.some(
          (subscriber: any) => subscriber.isOwner && subscriber.user?.id === user.uid
        );

        return {
          ...user,
          uid,
          isHost
        };
      });

    const allParticipants = [
      { ...localUser, isLocal: true, isHost: userIsHost },
      ...validRemoteParticipants
    ];

    return {
      participants: allParticipants.filter(p => p !== null && p !== undefined)
    };
  };

  const getVideoState = (participant: any) => {
    if (participant.isLocal) {
      return isCameraEnabled;
    }
    return participant.videoEnabled !== false && participant.videoTrack;
  };

  const getAudioState = (participant: any) => {
    if (participant.isLocal) {
      return isMicrophoneEnabled;
    }
    return participant.audioEnabled;
  };

  const getParticipantDisplayName = (participant: any) => {
    if (participant.isLocal) {
      return 'You';
    }
    return participant.name || `User ${participant.uid}`;
  };

  const renderParticipantVideo = (participant: any, customClasses = '') => {
    return (
      <div
        className={`relative h-full w-full rounded-lg overflow-hidden ${customClasses} 
          ${speakingParticipants[participant?.uid] ? 'border-2 border-green-500' : ''}`}
      >
        {!getVideoState(participant) ? (
          <VideoMutedDisplay participant={participant} />
        ) : (
          <StreamPlayer
            videoTrack={participant.videoTrack}
            audioTrack={participant.audioTrack}
            uid={participant.uid}
          />
        )}

        {showControls && (
          <>
            <div className="absolute top-0 right-0 p-2 flex flex-col gap-2">
              <div className="bg-black/50 p-1.5 rounded-lg">
                {getAudioState(participant) ? (
                  <Mic size={16} className="text-white" />
                ) : (
                  <MicOff size={16} className="text-red-500" />
                )}
              </div>
            </div>

            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
              {getParticipantDisplayName(participant)}
            </div>
          </>
        )}
      </div>
    );
  }

  const isScreenShared = () => {
    return isSharingScreen !== null;
  };

  const renderScreenShare = () => {
    if (!screenSharingUser) return null;

    if (screenSharingUser.isLocal) {
      return (
        <div className="basis-9/12 min-h-full bg-black">
          <div className="relative h-full w-full">
            <StreamPlayer
              videoTrack={screenTrack?.screenVideoTrack}
              audioTrack={screenTrack?.screenAudioTrack}
              className="h-full"
              isScreenShare={true}
            />
          </div>
        </div>
      );
    }

    const sharingParticipant = remoteParticipants[screenSharingUser.uid];
    if (sharingParticipant) {
      return (
        <div className="basis-9/12 min-h-full bg-black">
          <div className="relative h-full w-full">
            <StreamPlayer
              videoTrack={sharingParticipant.screenVideoTrack}
              audioTrack={sharingParticipant.screenAudioTrack}
              className="h-full"
              isScreenShare={true}
            />
            <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
              {getParticipantDisplayName(sharingParticipant)}&apos;s screen
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderParticipantsColumn = (participants: any) => (
    <div className="basis-3/12 min-h-full overflow-y-auto">
      <div className="flex flex-col gap-2 p-2 h-full">
        {participants.map((participant: any) => (
          <div key={participant.uid} className="h-40 min-h-40 flex-shrink-0">
            {renderParticipantVideo(participant)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegularGrid = (participants: any) => {
    const count = participants.length;

    if (count === 1) {
      return (
        <div className="h-full w-full flex items-center justify-center py-4">
          <div className="w-full h-full">
            {renderParticipantVideo(participants[0])}
          </div>
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="h-full w-full flex items-center justify-center py-4">
          <div className="flex gap-4 w-full">
            {participants.map((participant: any) => (
              <div key={participant.uid} className="w-1/2 h-96">
                {renderParticipantVideo(participant)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="h-full w-full flex items-center justify-center py-4">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              {participants.slice(0, 2).map((participant: any) => (
                <div key={participant.uid} className="w-1/2 h-80">
                  {renderParticipantVideo(participant)}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="w-1/2 h-80">
                {renderParticipantVideo(participants[2])}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="h-full w-full flex items-center justify-center p-4">
          <div className="flex flex-col gap-4 w-full">
            {[0, 2].map((startIndex) => (
              <div key={startIndex} className="flex gap-4">
                {participants.slice(startIndex, startIndex + 2).map((participant: any) => (
                  <div key={participant.uid} className="w-1/2 h-72">
                    {renderParticipantVideo(participant)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full w-full p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {participants.map((participant: any) => (
            <div key={participant.uid} className="h-64">
              {renderParticipantVideo(participant)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const { participants } = prepareParticipantsList();

  if (isScreenShared()) {
    return (
      <div className="h-full min-h-full w-full flex gap-2">
        {renderScreenShare()}
        {renderParticipantsColumn(participants)}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {renderRegularGrid(participants)}
    </div>
  );
};

export default VideoGrid;