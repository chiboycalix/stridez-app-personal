
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

export default function VideoInterface({ allowMicrophoneAndCamera, channelName, username }: { allowMicrophoneAndCamera: boolean, channelName: string; username: string }) {
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
    setUsername(username)
  }, [channelName, setChannelName, username, setUsername])


  return (
    <div>
      {
        hasJoinedMeeting ? <LiveStreamInterface /> :

          <div className="max-w-md mx-auto pt-2">
            <div className="flex flex-col items-center w-full mx-auto">
              <h1 className="text-2xl font-semibold">Get Started</h1>
              <p className="text-gray-600 mt-1">Setup your audio and video before joining</p>

              <div className="bg-red-500 text-white px-3 py-2 rounded-full mt-4 text-sm flex items-center gap-2">
                <span className='inline-block w-3 h-3 rounded-full bg-white'></span>
                <p>LIVE {allowMicrophoneAndCamera ? "Conferencing" : "Stream"}</p>
              </div>

              <div className="w-full aspect-video bg-gray-100 rounded-lg mt-6 relative h-[40vh]">
                <button className="absolute top-2 right-2 p-1 bg-black rounded-full z-10">
                  {isMicrophoneEnabled ? <Mic size={16} className="text-white" /> : <MicOff size={16} className="text-white" />}
                </button>
                <StreamPlayer
                  videoTrack={localUserTrack?.videoTrack || null}
                  audioTrack={localUserTrack?.audioTrack || null}
                  uid={meetingConfig?.uid || ""}
                />
              </div>
            </div>

            <Fragment>
              <div className='flex items-center justify-between mt-6 relative'>
                <div className='flex space-x-3 '>
                  <div className='w-16 h-10 bg-gray-100 flex items-center justify-center rounded cursor-pointer'>
                    <div onClick={toggleMicrophone} className='cursor-pointer'>
                      {isMicrophoneEnabled ? <Mic /> : <MicOff />}
                    </div>
                    <Fragment>
                      <MoreVertical size={20} onClick={() => setHandleSelectMicrophone(!handleSelectMicrophone)} className='cursor-pointer' />
                      <AnimatePresence>
                        {handleSelectMicrophone && localUserTrack?.audioTrack && (
                          <MicSelect audioTrack={localUserTrack.audioTrack} setHandleSelectMicrophone={setHandleSelectMicrophone} />
                        )}
                      </AnimatePresence>
                    </Fragment>
                  </div>
                  <div className='w-16 h-10 bg-gray-100 flex items-center justify-center rounded cursor-pointer'>
                    <div onClick={toggleCamera} className='cursor-pointer'>
                      {isCameraEnabled ? <Video /> : <VideoOff />}
                    </div>
                    <div>
                      <MoreVertical size={20} className='cursor-pointer' />
                    </div>
                  </div>
                </div>
                <div>
                  <div className='w-10 h-10 bg-white border flex items-center justify-center rounded cursor-pointer' onClick={() => setShowSettingsModal(!showSettingsModal)}>
                    <Settings size={20} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 gap-4">
                <div className='basis-10/12'>
                  <Input placeholder='Ore Aisha' className='py-2' onChange={(e) => { }} value={username} />
                </div>
                <Button onClick={handleGoLive} className="bg-primary hover:bg-primary-700 flex-1">
                  Go Live
                </Button>
              </div>

              <SettingsModal
                onClose={() => setShowSettingsModal(false)}
                isOpen={showSettingsModal}
              />
            </Fragment>
          </div>
      }
    </div>
  );
}