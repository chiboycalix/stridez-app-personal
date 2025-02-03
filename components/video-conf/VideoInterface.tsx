
"use client"
import SettingsModal from './SettingsModal';
import Input from '@/components/ui/Input';
import MicSelect from './MicSelect';
import { useVideoConferencing } from '@/context/VideoConferencingContext';
import { Mic, Video, Settings, MoreVertical, MicOff, VideoOff } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StreamPlayer } from './StreamPlayer';
import LiveStreamInterface from './LiveStreamInterface';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';


export default function VideoInterface({
  allowMicrophoneAndCamera,
  channelName,
  username
}: {
  allowMicrophoneAndCamera: boolean,
  channelName: string;
  username: string
}) {
  const { currentUser } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [handleSelectMicrophone, setHandleSelectMicrophone] = useState(false);
  const {
    isMicrophoneEnabled,
    setMeetingStage,
    setHasJoinedMeeting,
    hasJoinedMeeting,
    isCameraEnabled,
    toggleMicrophone,
    toggleCamera,
    setUsername,
    setChannelName,
    localUserTrack,
    meetingConfig,
    joinMeetingRoom
  } = useVideoConferencing();

  const handleGoLive = async () => {
    try {
      await joinMeetingRoom(channelName)
      setMeetingStage("hasJoinedMeeting")
      setHasJoinedMeeting(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    setChannelName(channelName)
    setUsername(currentUser.usernam)
  }, [channelName, setChannelName, username, setUsername])

  return (
    <div>
      {hasJoinedMeeting ? (
        <LiveStreamInterface />
      ) : (
        <div className="w-full max-w-md mx-auto px-0 sm:px-6 pt-2">
          <div className="flex flex-col items-center w-full">
            <h1 className="text-xl sm:text-2xl font-semibold text-center">Get Started</h1>
            <p className="text-gray-600 mt-1 text-center text-sm sm:text-base">
              Setup your audio and video before joining
            </p>

            <div className="bg-red-500 text-white px-3 py-2 rounded-full mt-4 text-sm flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-white"></span>
              <p>LIVE {allowMicrophoneAndCamera ? "Conferencing" : "Stream"}</p>
            </div>

            {/* Video Preview Container */}
            <div className="w-full aspect-video bg-gray-100 rounded-lg mt-4 sm:mt-6 relative">
              <button className="absolute top-2 right-2 p-1 bg-black rounded-full z-10">
                {isMicrophoneEnabled ? (
                  <Mic size={16} className="text-white" />
                ) : (
                  <MicOff size={16} className="text-white" />
                )}
              </button>
              <StreamPlayer
                videoTrack={localUserTrack?.videoTrack || null}
                audioTrack={localUserTrack?.audioTrack || null}
                uid={meetingConfig?.uid || ""}
              />
            </div>

            {/* Controls Section */}
            <div className="w-full mt-4 sm:mt-6">
              <div className="flex items-center justify-between relative">
                {/* Audio/Video Controls */}
                {/* <div className="flex space-x-2 sm:space-x-3">
                  <div className="flex items-center h-10 bg-gray-100 rounded px-2 sm:px-3">
                    <div onClick={toggleMicrophone} className="cursor-pointer p-1">
                      {isMicrophoneEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                    </div>
                    <div className="relative">
                      <MoreVertical
                        size={18}
                        onClick={() => setHandleSelectMicrophone(!handleSelectMicrophone)}
                        className="cursor-pointer ml-1"
                      />
                      <AnimatePresence>
                        {handleSelectMicrophone && localUserTrack?.audioTrack && (
                          <MicSelect
                            audioTrack={localUserTrack.audioTrack}
                            setHandleSelectMicrophone={setHandleSelectMicrophone}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex items-center h-10 bg-gray-100 rounded px-2 sm:px-3">
                    <div onClick={toggleCamera} className="cursor-pointer p-1">
                      {isCameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                    </div>
                    <MoreVertical size={18} className="cursor-pointer ml-1" />
                  </div>
                </div> */}

                {/* Settings Button */}
                {/* <div>
                  <button
                    className="w-10 h-10 bg-white border flex items-center justify-center rounded cursor-pointer"
                    onClick={() => setShowSettingsModal(!showSettingsModal)}
                  >
                    <Settings size={18} />
                  </button>
                </div> */}
              </div>

              {/* Username Input and Go Live Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between w-full mt-4">
                <div className='sm:basis-10/12 w-full'>
                  <Input
                    placeholder={username || "Enter your username"}
                    className="w-full py-2"
                    value={username}
                    onChange={(e) => { }}
                  />
                </div>
                <div className='sm:flex-1 w-full'>
                  <Button
                    onClick={handleGoLive}
                    className="bg-primary hover:bg-primary-700 w-full py-2"
                  >
                    Go Live
                  </Button>
                </div>
              </div>
            </div>

            <SettingsModal
              onClose={() => setShowSettingsModal(false)}
              isOpen={showSettingsModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}