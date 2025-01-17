/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react';
import IconButton from './IconButton';
import CallOptionsMenu from './CallOptionsMenu';
import VolumeControlPopup from './VolumeControlPopup';
import JoinRequestNotification from './JoinRequestNotification';
import EndCallScreen from './EndCallScreen';
import EmojiPopup from './EmojiPopup';
import { VideoGrid } from './VideoGrid';
import ChatAndParticipant from './ChatAndParticipant';
import InvitePeopleTab from './InvitePeople';
import { X, Mic, MoreVertical, Copy, Plus, StopCircleIcon, Dot, MicOff, Video, Share, MessageSquare, Menu, Users, Smile, SquareArrowOutUpRight, VideoOff, MonitorOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { useVideoConferencing } from '@/context/VideoConferencingContext';
import { useSearchParams } from 'next/navigation';
import { generalHelpers } from '@/helpers';
import { StreamPlayer } from './StreamPlayer';
import { Button } from '@/components/ui/button';

type JoinRequest = {
  id: string;
  name: string;
};

const LiveStreamInterface = () => {
  const [showInviteModal, setShowInviteModal] = useState(true);
  const [showInvitePeople, setShowInvitePeople] = useState(false);
  const [hasEndedCall, setHasEndedCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [optionsAnchorRect, setOptionsAnchorRect] = useState<DOMRect | null>(null);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [emojiAnchorRect, setEmojiAnchorRect] = useState<DOMRect | null>(null);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [volumeAnchorRect, setVolumeAnchorRect] = useState<DOMRect | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    remoteParticipants,
    remoteUsersRef,
    toggleMicrophone,
    toggleCamera,
    localUserTrack,
    meetingConfig,
    handleEndScreenShare,
    handleShareScreen,
    isSharingScreen
  } = useVideoConferencing();


  const totalParticipants = Object.keys(remoteParticipants || {}).length + 1;

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const newRequest = {
    id: 'unique-id',
    name: 'Matthew'
  } as any;

  useEffect(() => {
    if (newRequest) {
      setJoinRequests((requests: any) => [...requests, newRequest]);
    }
  }, []);

  useEffect(() => {
    remoteUsersRef.current = remoteParticipants;
  }, [remoteParticipants]);

  const handleAllow = (requesterId: string) => {
    console.log('Allowing user:', requesterId);
    setJoinRequests((requests: any) =>
      requests.filter((request: any) => request.id !== requesterId)
    );
  };

  const handleDeny = (requesterId: string) => {
    console.log('Denying user:', requesterId);
    setJoinRequests((requests: any) =>
      requests.filter((request: any) => request.id !== requesterId)
    );
  };

  const handleVolumeControlClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setVolumeAnchorRect(buttonRect);
    setShowVolumePopup(!showVolumePopup);
  };

  const handleEndCall = () => {
    setHasEndedCall(true);
    setShowInviteModal(false);
    setShowInvitePeople(false);
  };

  const handleRejoin = () => {
    setHasEndedCall(false);
    setShowInviteModal(true);
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setOptionsAnchorRect(buttonRect);
    setShowOptionsMenu(true);
  };

  const handleEmojiClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setEmojiAnchorRect(buttonRect);
    setShowEmojiPopup(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log('Selected emoji:', emoji);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[150] bg-white">
      <div className="w-full h-full flex flex-col max-w-[1440px] mx-auto p-2 md:p-4 lg:p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div className="w-6 md:w-8 lg:w-12" />
          <div className="bg-black flex items-center gap-1.5 md:gap-2 rounded-md p-2">
            <div className="text-white flex items-center gap-0.5 md:gap-1">
              <Dot className="text-red-600 w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6" />
              <span className="text-xs md:text-sm lg:text-base">LIVE 1:23</span>
            </div>
            <div className="text-white flex items-center gap-1 md:gap-2">
              <StopCircleIcon className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
              <span className="hidden md:inline text-xs md:text-sm lg:text-base">Record</span>
            </div>
          </div>
        </div>

        {/* Main Video Area */}
        <div className={cn(
          "relative flex-1 bg-black rounded-md overflow-hidden",
          showInvitePeople && "blur-sm"
        )}>

          {hasEndedCall ? (
            <EndCallScreen />
          ) : (
            <>
              <div className="text-white flex h-full">
                {/* Left Side - Only show when single participant */}
                <div className="w-8 md:w-12 lg:w-28 flex flex-col justify-end p-2">
                  <span className="text-xs md:text-sm lg:text-base">
                    {totalParticipants === 1 && generalHelpers.convertFromSlug(username!)}
                  </span>
                </div>

                {/* center side video grid */}
                <div className="flex-1">
                  <VideoGrid
                    localUser={{
                      videoTrack: localUserTrack?.videoTrack,
                      audioTrack: localUserTrack?.audioTrack,
                      uid: meetingConfig?.uid
                    }}
                    remoteParticipants={remoteParticipants}
                    StreamPlayer={StreamPlayer}
                    totalParticipants={totalParticipants}
                    showControls={totalParticipants > 1}
                  />
                </div>

                {/* Right Side - Only show when single participant */}
                <div className="w-8 md:w-12 lg:w-28 flex flex-col justify-between items-end p-2">
                  {
                    totalParticipants === 1 && (<>
                      <div className="cursor-pointer hover:bg-gray-800/50 p-1 md:p-1.5 lg:p-2 rounded-lg transition-colors">
                        {isMicrophoneEnabled ? (
                          <Mic className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        ) : (
                          <MicOff className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        )}
                      </div>
                      <div
                        onClick={handleVolumeControlClick}
                        className={cn(
                          "cursor-pointer hover:bg-gray-800/50 p-1 md:p-1.5 lg:p-2 rounded-lg transition-colors",
                          showVolumePopup && "bg-gray-800/50"
                        )}
                      >
                        <MoreVertical className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      </div>
                    </>)
                  }
                </div>
              </div>

              <AnimatePresence>
                {showChat && (
                  <ChatAndParticipant
                    onClose={() => setShowChat(false)}
                    localUser={{
                      videoTrack: localUserTrack?.videoTrack,
                      audioTrack: localUserTrack?.audioTrack,
                      uid: meetingConfig?.uid
                    }}
                    remoteParticipants={remoteParticipants}
                  />
                )}
              </AnimatePresence>
            </>
          )}

          {/* Invite Modal */}
          {showInviteModal && !hasEndedCall && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white rounded-lg p-2 md:p-3 lg:p-4 w-[90%] md:w-96 max-w-[95vw] md:max-w-md">
              <div className="flex justify-between items-center mb-2 md:mb-3">
                <h3 className="font-semibold text-sm md:text-base">You&apos;re set!</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                Use this meeting code to invite others to join.
              </p>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 mb-2 md:mb-3">
                <div className="flex-1 bg-primary-100 rounded-lg p-2 text-xs md:text-sm break-all">
                  adewale.stridez.com/instant
                </div>
                <button className="flex items-center justify-center gap-1 text-xs md:text-sm bg-primary-100 px-2 py-2 rounded-lg hover:bg-primary-200 transition-colors">
                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Copy link</span>
                </button>
              </div>
              <Button
                onClick={() => setShowInvitePeople(true)}
                className="w-1/3 flex items-center justify-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs md:text-sm hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 bg-white text-primary" />
                Invite
              </Button>
            </div>
          )}
        </div>

        {/* Request to Join Call */}
        {joinRequests.map((request, index) => (
          <JoinRequestNotification
            key={index}
            requesterName={request.name}
            onAllow={() => handleAllow(request.id)}
            onDeny={() => handleDeny(request.id)}
            onClose={() =>
              setJoinRequests(requests =>
                requests.filter(r => r.id !== request.id)
              )
            }
          />
        ))}

        {/* Invite People Modal */}
        {showInvitePeople && !hasEndedCall && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg w-[90%] md:w-[560px] max-h-[80vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Invite People</h2>
                <button
                  onClick={() => setShowInvitePeople(false)}
                  className="hover:bg-gray-100 p-1.5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <InvitePeopleTab />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className={cn(
          "mt-4 md:mt-8",
          showInvitePeople && "blur-sm"
        )}>
          <div className="overflow-x-auto pb-4 md:pb-0">
            <div className="flex items-center justify-between min-w-[640px] md:min-w-0 gap-4 md:grid md:grid-cols-3 md:gap-2 lg:gap-4">
              <div className="flex items-center gap-1 md:gap-2">
                <IconButton
                  leftIcon={isMicrophoneEnabled ? <Mic size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" /> : <MicOff size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />}
                  showDivider
                  onLeftClick={toggleMicrophone}
                  onRightClick={() => { }}
                  className=""
                  tooltip="Toggle microphone"
                  rightTooltip="Microphone settings"
                />
                <IconButton
                  leftIcon={isCameraEnabled ? <Video size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" /> : <VideoOff size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />}
                  showDivider
                  onLeftClick={toggleCamera}
                  onRightClick={() => { }}
                  className=""
                  tooltip="Toggle Video"
                  rightTooltip="Microphone settings"
                />
              </div>

              {/* Center section */}
              <div className="flex items-center justify-center gap-1 md:gap-2">
                <IconButton
                  leftIcon={isSharingScreen ? <Share size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5 rotate-180" /> : <Share size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  }
                  showDivider
                  onLeftClick={isSharingScreen ? handleEndScreenShare : handleShareScreen}  // Use the new handler
                  onRightClick={() => { }}
                  className=""
                  tooltip=""
                  rightTooltip="Screen sharing settings"
                />
                <IconButton
                  leftIcon={<SquareArrowOutUpRight size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />}
                  onLeftClick={() => { }}
                  className=""
                  tooltip="Share screen"
                  rightTooltip="Share screen settings"
                />
                <IconButton
                  leftIcon={<Smile size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />}
                  onLeftClick={handleEmojiClick}
                  className={cn(
                    showEmojiPopup && "bg-gray-100"
                  )}
                  tooltip="Reactions"
                />
                <IconButton
                  leftIcon={<Share size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5 -rotate-90" />}
                  showDivider
                  onLeftClick={handleEndCall}
                  className="bg-red-600 text-white hover:bg-red-600"
                  iconClass="hover:bg-red-700 text-white"
                  tooltip="End call"
                  rightTooltip="End call options"
                />
              </div>

              {/* Right section */}
              <div className="flex items-center justify-end gap-1 md:gap-2">
                <IconButton
                  leftIcon={<MessageSquare size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />}
                  onLeftClick={() => setShowChat(!showChat)}
                  className={cn(showChat && "bg-primary-100 text-primary-900")}
                  tooltip="Toggle chat"
                />
                <IconButton
                  leftIcon={<Users size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />}
                  showDivider
                  rightIcon={totalParticipants}
                  onLeftClick={() => setShowChat(!showChat)}
                  onRightClick={() => setShowChat(!showChat)}
                  className={""}
                  tooltip="Toggle participants list"
                  rightTooltip="Show all participants"
                />
                <IconButton
                  leftIcon={<Menu size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />}
                  onLeftClick={handleOptionsClick}
                  className={cn(
                    showOptionsMenu && "bg-gray-100"
                  )}
                  tooltip="More options"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CallOptionsMenu
        isOpen={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        anchorRect={optionsAnchorRect}
      />
      <EmojiPopup
        isOpen={showEmojiPopup}
        onClose={() => setShowEmojiPopup(false)}
        onEmojiSelect={handleEmojiSelect}
        anchorRect={emojiAnchorRect}
      />
      <VolumeControlPopup
        isOpen={showVolumePopup}
        onClose={() => setShowVolumePopup(false)}
        anchorRect={volumeAnchorRect}
      />
    </div>
  );
};

export default LiveStreamInterface;