"use client"
import AgoraRTM, { RtmChannel, RtmClient } from "agora-rtm-sdk";
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { ILocalTrack, Options } from '@/types';
import { createContext, useContext, useState, ReactNode, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { agoraGetAppData } from '@/lib';
import { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { rateLimiter } from "@/utils/MessageRateLimiter";

interface RemoteParticipant {
  name: string;
  rtcUid: string;
  videoTrack?: IRemoteVideoTrack | null;
  audioTrack?: IRemoteAudioTrack;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isScreenShare?: boolean;
}

interface VideoConferencingContextContextType {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  meetingRoomId: string;
  setMeetingRoomId: (id: string) => void;
  isMicrophoneEnabled: boolean;
  isCameraEnabled: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  localUserTrack: ILocalTrack | undefined
  meetingConfig: Options;
  videoRef: any;
  initializeLocalMediaTracks: () => void;
  setLocalUserTrack: any
  releaseMediaResources: () => void
  publishLocalMediaTracks: () => void;
  joinMeetingRoom: (meegtingId: string) => void;
  setMeetingStage: (meetingStage: string) => void;
  setChannelName: (meetingStage: string) => void;
  channelName: string;
  meetingStage: string;
  remoteParticipants: Record<string, any>;
  hasJoinedMeeting: boolean;
  remoteUsersRef: any;
  setUsername: (username: string) => void;
  setHasJoinedMeeting: (join: boolean) => void;
  username: string;
  speakingParticipants: any;
  handleShareScreen: any;
  handleEndScreenShare: any;
  isSharingScreen: any;
  userIsHost: boolean;
  userIsCoHost: boolean;
  meetingRoomData: any;
  screenTrack: any;
  screenSharingUser: any;
  leaveCall: () => Promise<void>;
}

let rtcClient: IAgoraRTCClient;
let rtmClient: RtmClient;
let rtmChannel: RtmChannel;
let rtcScreenShareClient: IAgoraRTCClient;

const VideoConferencingContext = createContext<VideoConferencingContextContextType | undefined>(undefined);

const useRTMMessageHandler = (
  rtmChannel: RtmChannel | null,
  meetingConfig: Options,
  username: string,
  updateRemoteParticipant: (uid: string, updates: any) => void,
  setScreenShare: (uid: string | null, isLocal: boolean) => void,
  setSpeakingParticipants: (update: any) => void,
) => {
  const handleRTMMessage = useCallback(async ({ text, peerId }: any) => {
    if (!text) return;

    try {
      const message = JSON.parse(text);
      const uid = String(message.uid).replace(/[^a-zA-Z0-9]/g, '');

      switch (message.type) {
        case 'video-state':
          updateRemoteParticipant(uid, {
            videoEnabled: message.enabled
          });
          break;

        case 'audio-state':
          updateRemoteParticipant(uid, {
            audioEnabled: message.enabled
          });
          break;

        case 'speaking-state':
          setSpeakingParticipants((prev: any) => ({
            ...prev,
            [uid]: message.isSpeaking
          }));
          break;

        case 'screen-share-state':
          if (message.isSharing) {
            setScreenShare(String(message.uid), false);
          } else {
            setScreenShare(null, false);
          }
          break;

        case 'user-info':
          if (uid === String(meetingConfig.uid)) return;

          updateRemoteParticipant(uid, {
            name: message.name,
            rtcUid: uid
          });
          break;
      }
    } catch (error) {
      console.error("Error processing RTM message:", error);
    }
  }, [meetingConfig.uid, updateRemoteParticipant, setScreenShare, setSpeakingParticipants]);

  useEffect(() => {
    if (!rtmChannel) return;

    rtmChannel.on("ChannelMessage", handleRTMMessage);
    return () => {
      rtmChannel.off("ChannelMessage", handleRTMMessage);
    };
  }, [rtmChannel, handleRTMMessage]);
};

export function VideoConferencingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [meetingRoomId, setMeetingRoomId] = useState('');
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [hasJoinedMeeting, setHasJoinedMeeting] = useState(false);
  const [meetingStage, setMeetingStage] = useState("prepRoom");
  const [remoteParticipants, setRemoteParticipants] = useState<Record<string, any>>({});
  const [remoteScreenShareParticipants, setRemoteScreenShareParticipants] = useState<Record<
    string,
    any
  > | null>({});

  const [username, setUsername] = useState("")
  const [channelName, setChannelName] = useState("")
  const [localUserTrack, setLocalUserTrack] = useState<ILocalTrack | undefined | any>(undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteUsersRef = useRef(remoteParticipants);
  const [speakingParticipants, setSpeakingParticipants] = useState<Record<string, boolean>>({});
  const remoteScreenShareParticipantsRef = useRef(remoteScreenShareParticipants);
  const [meetingRoomData, setMeetingRoomData] = useState<any | null>(null);
  const [userIsHost, setUserIsHost] = useState(false);
  const [userIsCoHost, setUserIsCoHost] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState<string | null>(null);
  const [screenSharingUser, setScreenSharingUser] = useState<{
    uid: string;
    isLocal: boolean;
  } | null>(null);

  useEffect(() => {
    AgoraRTC.setLogLevel(4);
    AgoraRTC.disableLogUpload();
  }, []);

  const [meetingConfig, setMeetingConfig] = useState<Options>({
    channel: "",
    appid: "d9b1d4e54b9e4a01aac1de9833d83752",
    rtcToken: "",
    rtmToken: "",
    proxyMode: "",
    audienceLatency: 1,
    uid: null,
    role: "host",
    certificate: "",
  });

  const [rtcScreenShareOptions, setRtcScreenShareOptions] = useState<Options>({
    channel: "",
    appid: "d9b1d4e54b9e4a01aac1de9833d83752",
    rtcToken: "",
    rtmToken: "",
    proxyMode: "",
    audienceLatency: 1,
    uid: null,
    role: "host",
    certificate: "",
  });

  const setScreenShare = useCallback((uid: string | null, isLocal: boolean) => {
    setIsSharingScreen(uid);
    if (uid) {
      setScreenSharingUser({
        uid,
        isLocal
      });
    } else {
      setScreenSharingUser(null);
    }
  }, []);

  const updateRemoteParticipant = useCallback((uid: string, updates: Partial<any>) => {
    setRemoteParticipants(prev => {
      const participant = prev[uid];
      if (!participant) return prev; // Don't update if participant doesn't exist

      // Only update if values actually changed
      const hasChanges = Object.entries(updates).some(
        ([key, value]) => participant[key] !== value
      );

      if (!hasChanges) return prev;

      return {
        ...prev,
        [uid]: {
          ...participant,
          ...updates
        }
      };
    });
  }, []);

  useRTMMessageHandler(
    rtmChannel,
    meetingConfig,
    username,
    updateRemoteParticipant,
    setScreenShare,
    setSpeakingParticipants
  );

  const sendRateLimitedMessage = async (message: any) => {
    if (!rtmChannel) return;

    try {
      await rateLimiter.sendMessage(rtmChannel, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const [screenTrack, setScreenTrack] = useState<{
    screenVideoTrack: ILocalVideoTrack | null;
    screenAudioTrack: ILocalAudioTrack | null;
  } | null>(null);

  const handleMediaTrackUpdate = useCallback(async (uid: string, mediaType: 'audio' | 'video', track: any, enabled: boolean) => {
    updateRemoteParticipant(uid, {
      [`${mediaType}Track`]: track,
      [`${mediaType}Enabled`]: enabled,
      [`has${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`]: true
    });

    if (mediaType === 'audio' && track) {
      track.setVolume(100);
      await track.play();
    }
  }, [updateRemoteParticipant]);

  useEffect(() => {
    remoteScreenShareParticipantsRef.current = remoteScreenShareParticipants;
  }, [remoteScreenShareParticipants]);

  const handleMeetingHostAndCohost = useCallback(() => {
    if (meetingRoomData) {

      const isHost = meetingRoomData?.room?.roomSubscribers?.some(
        (user: { isOwner: boolean }) => user.isOwner
      );

      const isCoHost = meetingRoomData?.room?.roomSubscribers?.some(
        (user: { isCoHost: boolean }) => user.isCoHost
      );

      setUserIsHost(isHost);
      setUserIsCoHost(isCoHost);
    }
  }, [meetingRoomData]);

  const fetchMeetingRoomData = useCallback(async () => {
    try {
      const data = await agoraGetAppData(channelName);
      setMeetingRoomData(data.data);
      handleMeetingHostAndCohost();
    } catch (error) {
      console.log("Error fetching meeting room data:", error);
    }
  }, [channelName, handleMeetingHostAndCohost]);

  useEffect(() => {
    if (channelName && username) {
      const fetchAgoraData = async () => {
        try {
          const rtcData = await agoraGetAppData(channelName);
          const { joinRoom, client } = rtcData;

          setMeetingConfig((prev) => ({
            ...prev,
            appid: client[0].appId,
            rtcToken: client[0].rtcToken,
            rtmToken: client[0].rtmToken,
            certificate: client[0].appCertificate,
            uid: client[0].uid,
            channel: client[0].channelName,
          }));

          setRtcScreenShareOptions((prev) => ({
            ...prev,
            appid: client[1].appId,
            rtcToken: client[1].rtcToken,
            rtmToken: client[1].rtmToken,
            certificate: client[1].appCertificate,
            uid: client[1].uid,
            channel: client[1].channelName,
          }));

        } catch (error) {
          console.log("Error fetching Agora data:", error);
        }
      };

      fetchAgoraData();
      fetchMeetingRoomData();
    }
  }, [channelName, username, fetchMeetingRoomData]);

  useEffect(() => {
    handleMeetingHostAndCohost();
  }, [handleMeetingHostAndCohost, meetingRoomData]);

  const handleScreenShareUserLeft = async (user: any) => {
    const uid = String(user.uid);
    const updatedScreenShareUsers = { ...remoteScreenShareParticipantsRef.current };
    delete updatedScreenShareUsers[uid];
    remoteScreenShareParticipantsRef.current = updatedScreenShareUsers;
    setRemoteScreenShareParticipants(updatedScreenShareUsers);
  };

  const handleShareScreen = async () => {
    try {
      await joinRtcScreenShare();
      if (rtcScreenShareClient) {
        const screenTracks = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "1080p_1",
            optimizationMode: "detail",
          },
          "auto"
        );

        // Separate video and audio tracks
        const screenVideoTrack =
          screenTracks instanceof Array ? screenTracks[0] : screenTracks;
        const screenAudioTrack =
          screenTracks instanceof Array ? screenTracks[1] : null;

        if (!screenVideoTrack) {
          return;
        }

        // Bind the "track-ended" event to handle stop sharing
        screenVideoTrack.on("track-ended", handleScreenTrackEnd);

        // Update screenTrack state
        setScreenTrack({
          screenVideoTrack,
          screenAudioTrack,
        });

        setIsSharingScreen(String(meetingConfig.uid));
        setScreenSharingUser({
          uid: String(meetingConfig.uid),
          isLocal: true
        });

        if (screenVideoTrack) {
          await rtcScreenShareClient.publish([screenVideoTrack]);
        }

        if (screenAudioTrack) {
          await rtcScreenShareClient.publish([screenAudioTrack]);
        }
        if (rtmChannel) {
          await rtmChannel.sendMessage({
            text: JSON.stringify({
              type: 'screen-share-state',
              uid: meetingConfig.uid,
              isSharing: true
            })
          });
        }
      }
    } catch (error) {
      console.log("Error during screen sharing:", error);
    }
  };

  const handleScreenTrackEnd = useCallback(async () => {
    setIsSharingScreen(null);
    setScreenSharingUser(null);
    if (screenTrack?.screenVideoTrack) {
      screenTrack.screenVideoTrack.close();
      screenTrack.screenVideoTrack.stop();
    }
    if (screenTrack?.screenAudioTrack) {
      screenTrack.screenAudioTrack.close();
      screenTrack.screenAudioTrack.stop();
    }
    setScreenTrack(null);
    await rtcScreenShareClient.unpublish();
    await rtcScreenShareClient.leave();
    rtcScreenShareClient = null as any;

    if (rtmChannel) {
      await rtmChannel.sendMessage({
        text: JSON.stringify({
          type: 'screen-share-state',
          uid: meetingConfig.uid,
          isSharing: false
        })
      });
    }
  }, [meetingConfig.uid, screenTrack?.screenAudioTrack, screenTrack?.screenVideoTrack]);

  const handleEndScreenShare = useCallback(async (action: string, uid: number) => {
    await handleScreenTrackEnd();
    if (rtmChannel) {
      await rtmChannel.sendMessage({
        text: JSON.stringify({
          command: action,
          uid,
          type: 'screen-share-state',
          isSharing: false
        })
      });
    }
  }, [handleScreenTrackEnd]);

  const joinRtcScreenShare = async () => {
    if (!rtcScreenShareClient) {
      rtcScreenShareClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      });

      rtcScreenShareClient.on("user-left", handleScreenShareUserLeft);
      rtcScreenShareClient.on("user-published", handleUserPublishedScreen);
      rtcScreenShareClient.on("user-unpublished", handleUserUnpublishedScreen);
      rtcScreenShareClient.on("connection-state-change", (curState, prevState) => { });

      const mode = rtcScreenShareOptions?.proxyMode ?? 0;
      if (mode !== 0 && !isNaN(parseInt(mode))) {
        rtcScreenShareClient.startProxyServer(parseInt(mode));
      }

      if (rtcScreenShareOptions.role === "audience") {
        rtcScreenShareClient.setClientRole(rtcScreenShareOptions.role, {
          level: rtcScreenShareOptions.audienceLatency,
        });
      } else if (rtcScreenShareOptions.role === "host") {
        rtcScreenShareClient.setClientRole(rtcScreenShareOptions.role);
      }

      try {
        if (rtcScreenShareOptions) {
          const sanitizedUid = String(rtcScreenShareOptions.uid).replace(/[^a-zA-Z0-9]/g, '') as any;
          await rtcScreenShareClient.join(
            rtcScreenShareOptions.appid || "",
            rtcScreenShareOptions.channel || "",
            rtcScreenShareOptions.rtcToken || null,
            sanitizedUid
          );
        }
      } catch (error) {
        console.error('Error joining screen share client:', error);
        throw error;
      }
    }
  };

  const handleUserPublishedScreen = async (user: any, mediaType: "audio" | "video") => {
    try {
      if ((mediaType === 'video' && !user.hasVideo) ||
        (mediaType === 'audio' && !user.hasAudio)) {
        return;
      }

      if (mediaType === 'video' && user.videoTrack && !user.videoTrack.isScreenTrack) {
        return;
      }

      await rtcSubscribeScreen(user, mediaType);
    } catch (error) {
      console.error('Error in handleUserPublishedScreen:', error);
    }
  };

  const rtcSubscribeScreen = async (user: any, mediaType: "audio" | "video") => {
    try {
      if ((mediaType === 'video' && !user.hasVideo) ||
        (mediaType === 'audio' && !user.hasAudio)) {
        return;
      }

      if (!rtcScreenShareClient) {
        return;
      }

      const subscribedUsers = rtcScreenShareClient.remoteUsers;
      const isAlreadySubscribed = subscribedUsers.some(
        (subscribedUser) => subscribedUser.uid === user.uid &&
          ((mediaType === 'video' && subscribedUser.hasVideo) ||
            (mediaType === 'audio' && subscribedUser.hasAudio))
      );

      if (isAlreadySubscribed) {
        return;
      }

      // Attempt to subscribe with error handling
      await rtcScreenShareClient.subscribe(user, mediaType);

      const uid = String(user.uid);
      if (mediaType === "video" && user.videoTrack && user.videoTrack.isScreenTrack) {
        const videoTrack = user.videoTrack;

        setRemoteScreenShareParticipants((prevUsers) => ({
          ...prevUsers,
          [uid]: {
            ...prevUsers![uid],
            videoTrack,
          },
        }));

        // Update the screen sharing state
        setIsSharingScreen(uid);
        setScreenSharingUser({
          uid: uid,
          isLocal: false
        });
      }

      if (mediaType === "audio" && user.audioTrack) {
        const audioTrack = user.audioTrack;
        try {
          await audioTrack.play();
        } catch (error) {
          console.log('Error playing audio track:', error);
        }
      }

    } catch (error: any) {
      if (error.code === 'UNEXPECTED_RESPONSE' || error.code === 'ERR_SUBSCRIBE_REQUEST_INVALID') {
        console.log(`Stream not available for user ${user.uid} ${mediaType}. Skipping subscription.`);
        return;
      }
      console.error(`Error subscribing to ${mediaType}:`, error);
    }
  };

  const handleUserUnpublishedScreen = (
    user: any,
    mediaType: "audio" | "video"
  ) => {
    const uid = String(user.uid);
    setRemoteScreenShareParticipants((prevUsers) => ({
      ...prevUsers,
      [uid]: {
        ...prevUsers![uid],
        [mediaType]: null,
      },
    }));
  };

  const initializeLocalMediaTracks = async () => {
    try {
      if (localUserTrack?.videoTrack) {
        localUserTrack.videoTrack.stop();
        await localUserTrack.videoTrack.close();
      }
      if (localUserTrack?.audioTrack) {
        localUserTrack.audioTrack.stop();
        await localUserTrack.audioTrack.close();
      }

      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack({ encoderConfig: "music_standard" }),
        AgoraRTC.createCameraVideoTrack()
      ]);

      await audioTrack.setEnabled(isMicrophoneEnabled);
      await videoTrack.setEnabled(isCameraEnabled);

      setLocalUserTrack({
        audioTrack,
        videoTrack,
        screenTrack: null,
      });

    } catch (error) {
      console.log("Error configuring waiting area:", error);
    }
  };

  const releaseMediaResources = useCallback(async () => {
    try {
      if (localUserTrack?.videoTrack) {
        localUserTrack.videoTrack.stop();
        await localUserTrack.videoTrack.close();
      }
      if (localUserTrack?.audioTrack) {
        localUserTrack.audioTrack.stop();
        await localUserTrack.audioTrack.close();
      }
      if (localUserTrack?.screenTrack) {
        localUserTrack.screenTrack.stop();
        await localUserTrack.screenTrack.close();
      }

      setIsSharingScreen(null);
      const streams = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streams.getTracks().forEach(track => {
        track.stop();
      });

      // Also get all active media tracks and stop them
      const allTracks = document.querySelectorAll('video, audio');
      allTracks.forEach(element => {
        const mediaElement = element as HTMLMediaElement;
        if (mediaElement.srcObject instanceof MediaStream) {
          const stream = mediaElement.srcObject;
          stream.getTracks().forEach(track => {
            track.stop();
          });
          mediaElement.srcObject = null;
        }
      });

      setLocalUserTrack(undefined);
      setIsCameraEnabled(true);
      setIsMicrophoneEnabled(true);
    } catch (error) {
      console.log("Error cleaning up tracks:", error);
    }
  }, [localUserTrack?.audioTrack, localUserTrack?.screenTrack, localUserTrack?.videoTrack]);

  const toggleMicrophone = async () => {
    if (localUserTrack && localUserTrack.audioTrack) {
      try {
        const newState = !isMicrophoneEnabled;
        await localUserTrack.audioTrack.setEnabled(newState);
        if (hasJoinedMeeting && rtcClient) {
          if (newState) {
            const isPublished = rtcClient.localTracks.includes(localUserTrack.audioTrack);
            if (!isPublished) {
              await rtcClient.publish([localUserTrack.audioTrack]);
            }
          } else {
            await rtcClient.unpublish([localUserTrack.audioTrack]);
          }
        }
        ensureRemoteAudioPlaying();

        if (rtmChannel) {
          await sendRateLimitedMessage({
            text: JSON.stringify({
              type: 'audio-state',
              uid: meetingConfig.uid,
              enabled: newState
            })
          });
        }

        setIsMicrophoneEnabled(newState);
      } catch (error) {
        console.error("Error toggling audio:", error);
      }
    }
  };

  const toggleCamera = async () => {
    try {
      if (localUserTrack?.videoTrack) {
        const newState = !isCameraEnabled;
        await localUserTrack.videoTrack.setEnabled(newState);
        if (hasJoinedMeeting && rtcClient) {
          if (newState) {
            const isPublished = rtcClient.localTracks.includes(localUserTrack.videoTrack);
            if (!isPublished) {
              await rtcClient.publish([localUserTrack.videoTrack]);
            }
          } else {
            await rtcClient.unpublish([localUserTrack.videoTrack]);
          }
        }

        if (rtmChannel) {
          await sendRateLimitedMessage({
            text: JSON.stringify({
              type: 'video-state',
              uid: meetingConfig.uid,
              enabled: newState,
              hasTrack: true,
              timestamp: Date.now()
            })
          });
        }

        setIsCameraEnabled(newState);
      }
    } catch (error) {
      console.log("Error toggling video:", error);
    }
  };

  useEffect(() => {
    if (hasJoinedMeeting) {
      const audioCheckInterval = setInterval(ensureRemoteAudioPlaying, 5000);

      return () => clearInterval(audioCheckInterval);
    }
  }, [hasJoinedMeeting]);

  useEffect(() => {
    rateLimiter.startResetTimer();
    return () => rateLimiter.stopResetTimer();
  }, []);

  const broadcastCurrentMediaStates = useCallback(async () => {
    if (!rtmChannel) return;

    await sendRateLimitedMessage({
      text: JSON.stringify({
        type: 'video-state',
        uid: meetingConfig.uid,
        enabled: isCameraEnabled,
        hasTrack: !!localUserTrack?.videoTrack,
        timestamp: Date.now()
      })
    });

    // Queue audio state message
    await sendRateLimitedMessage({
      text: JSON.stringify({
        type: 'audio-state',
        uid: meetingConfig.uid,
        enabled: isMicrophoneEnabled,
        timestamp: Date.now()
      })
    });
  }, [isCameraEnabled, isMicrophoneEnabled, localUserTrack?.videoTrack, meetingConfig.uid]);

  const onParticipantJoined = useCallback(async (memberId: string) => {
    try {
      if (memberId === String(meetingConfig.uid)) {
        return;
      }

      if (remoteParticipants[memberId]) {
        return;
      }

      const attributes = await rtmClient.getUserAttributesByKeys(memberId, [
        "name",
        "userRtcUid",
      ]);

      const participantData = {
        name: attributes.name || "Anonymous",
        rtcUid: attributes.userRtcUid,
        audioEnabled: true,
        videoEnabled: true,
      };

      setRemoteParticipants(prevParticipants => ({
        ...prevParticipants,
        [memberId]: participantData,
      }));

      remoteUsersRef.current = {
        ...remoteUsersRef.current,
        [memberId]: participantData,
      };

      if (rtmChannel) {
        await rtmChannel.sendMessage({
          text: JSON.stringify({
            type: 'user-info',
            uid: meetingConfig.uid,
            name: username,
          })
        });
        await broadcastCurrentMediaStates();
      }
      fetchMeetingRoomData();
    } catch (error) {
      console.log("Error handling participant join:", error);
    }
  }, [username, meetingConfig.uid, remoteParticipants, broadcastCurrentMediaStates, fetchMeetingRoomData]);

  const onMemberDisconnected = useCallback(async (memberId: string) => {
    try {
      // If it's the local user, ignore
      if (memberId === String(meetingConfig.uid)) {
        return;
      }

      // Clean up speaking state
      setSpeakingParticipants(prev => {
        const updated = { ...prev };
        delete updated[memberId];
        return updated;
      });

      // Clean up screen sharing if the leaving member was sharing
      if (isSharingScreen === memberId) {
        setIsSharingScreen(null);
        setScreenSharingUser(null);
      }

      // Remove from remote participants
      setRemoteParticipants(prev => {
        const updated = { ...prev };

        // If the participant had any tracks, close them
        const participant = updated[memberId];
        if (participant) {
          if (participant.audioTrack) {
            participant.audioTrack.stop();
          }
          if (participant.videoTrack) {
            participant.videoTrack.stop();
          }
        }

        delete updated[memberId];
        return updated;
      });

      // Update the reference
      remoteUsersRef.current = {
        ...remoteUsersRef.current
      };
      delete remoteUsersRef.current[memberId];

      // Fetch updated meeting room data to reflect new participant list
      await fetchMeetingRoomData();

    } catch (error) {
      console.error("Error handling member disconnection:", error);
    }
  }, [meetingConfig.uid, isSharingScreen, fetchMeetingRoomData]);

  const fetchActiveMeetingParticipants = async () => {
    try {
      const members = await rtmChannel.getMembers();
      const participantsData: Record<string, RemoteParticipant> = {};

      for (const memberId of members) {
        if (memberId === String(meetingConfig.uid)) {
          continue;
        }

        if (remoteParticipants[memberId]) {
          continue;
        }

        const attributes = await rtmClient.getUserAttributesByKeys(memberId, [
          "name",
          "userRtcUid",
        ]);

        participantsData[memberId] = {
          name: attributes.name || "Anonymous",
          rtcUid: attributes.userRtcUid,
          audioEnabled: false,
          videoEnabled: false
        };
      }

      setRemoteParticipants(prevParticipants => {
        const newParticipants = { ...prevParticipants };
        Object.entries(participantsData).forEach(([id, data]) => {
          if (!newParticipants[id]) {
            newParticipants[id] = data;
          }
        });
        return newParticipants;
      });

      remoteUsersRef.current = {
        ...remoteUsersRef.current,
        ...participantsData,
      };
    } catch (error) {
      console.log("Error fetching active participants:", error);
    }
  };

  const initializeRealtimeMessaging = useCallback(async (name: string) => {
    try {
      if (!meetingConfig.appid || !meetingConfig.rtmToken || !meetingConfig.channel) {
        console.error('Missing required RTM configuration');
        return;
      }

      rtmClient = AgoraRTM.createInstance(meetingConfig.appid);
      const sanitizedUid = String(meetingConfig.uid).replace(/[^a-zA-Z0-9]/g, '');

      await rtmClient.login({
        uid: sanitizedUid,
        token: meetingConfig.rtmToken,
      });

      const channel = rtmClient.createChannel(meetingConfig.channel);
      rtmChannel = channel;
      await channel.join();

      await rtmClient.addOrUpdateLocalUserAttributes({
        name: name.slice(0, 64),
        userRtcUid: sanitizedUid,
      });

      // Initial user info broadcast
      await channel.sendMessage({
        text: JSON.stringify({
          type: 'user-info',
          uid: sanitizedUid,
          name: name,
        })
      });

      // Set up member join/leave handlers
      channel.on("MemberJoined", onParticipantJoined);
      channel.on("MemberLeft", onMemberDisconnected);

      window.addEventListener("beforeunload", disconnectFromMessaging);

      await fetchActiveMeetingParticipants();
    } catch (error) {
      console.error("Error in initializeRealtimeMessaging:", error);
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    meetingConfig.appid,
    meetingConfig.rtmToken,
    meetingConfig.channel,
    meetingConfig.uid,
    onMemberDisconnected,
  ]);

  const onMediaStreamPublished = useCallback(async (user: any, mediaType: "audio" | "video") => {
    try {
      await rtcClient.subscribe(user, mediaType);
      const uid = String(user.uid);

      if (mediaType === "video" && !user.videoTrack?.isScreenTrack) {
        await handleMediaTrackUpdate(uid, 'video', user.videoTrack, true);
      }

      if (mediaType === "audio") {
        await handleMediaTrackUpdate(uid, 'audio', user.audioTrack, true);
      }
    } catch (error) {
      console.error("[STREAM-ERROR] Error in onMediaStreamPublished:", error);
    }
  }, [handleMediaTrackUpdate]);

  const ensureRemoteAudioPlaying = () => {
    rtcClient?.remoteUsers.forEach(user => {
      if (user.audioTrack) {
        user.audioTrack.setVolume(100);
        if (!user.audioTrack.isPlaying) {
          user.audioTrack.play()
        }
      }
    });
  };

  const onMediaStreamUnpublished = useCallback(async (user: any, mediaType: "audio" | "video") => {
    const uid = String(user.uid);

    if (mediaType === "video" && user.videoTrack?.isScreenTrack) {
      if (isSharingScreen === uid) {
        setIsSharingScreen(null);
        setScreenSharingUser(null);
      }
    } else {
      updateRemoteParticipant(uid, {
        [`${mediaType}Track`]: null,
        [`${mediaType}Enabled`]: false
      });
    }

    await rtcClient?.unsubscribe(user, mediaType);
  }, [isSharingScreen, updateRemoteParticipant]);

  const publishLocalMediaTracks = async () => {
    if (!rtcClient) {
      return;
    }

    try {
      const tracksToPublish = [];

      if (localUserTrack?.audioTrack && isMicrophoneEnabled) {
        tracksToPublish.push(localUserTrack.audioTrack);
      }

      if (localUserTrack?.videoTrack && isCameraEnabled) {
        tracksToPublish.push(localUserTrack.videoTrack);
      }

      if (tracksToPublish.length > 0) {
        await rtcClient.publish(tracksToPublish);
      }
    } catch (error) {
      console.log("Error publishing media tracks:", error);
    }
  };

  const onParticipantLeft = useCallback((user: any) => {
    const uid = String(user.uid);

    setSpeakingParticipants(prev => {
      const updated = { ...prev };
      delete updated[uid];
      return updated;
    });

    setRemoteParticipants(prev => {
      const updated = { ...prev };
      delete updated[uid];
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!hasJoinedMeeting || !rtcClient) return;

    const cleanup = () => {
      if (rtcClient) {
        rtcClient.removeAllListeners();
      }
    };

    rtcClient.on("user-published", onMediaStreamPublished);
    rtcClient.on("user-unpublished", onMediaStreamUnpublished);
    rtcClient.on("user-left", onParticipantLeft);

    return cleanup;
  }, [hasJoinedMeeting, onMediaStreamPublished, onMediaStreamUnpublished, onParticipantLeft]);

  useEffect(() => {
    remoteUsersRef.current = remoteParticipants;
  }, [remoteParticipants]);

  const subscribeToExistingParticipants = async () => {
    if (!rtcClient) return;
    const remoteUsers = rtcClient.remoteUsers;

    for (const user of remoteUsers) {
      if (user.hasVideo) {
        await subscribeToParticipantMedia(user, 'video');
      }
      if (user.hasAudio) {
        await subscribeToParticipantMedia(user, 'audio');
      }
    }
  };

  const connectToMeetingRoom = async () => {
    try {
      rtcClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      });

      rtcClient.on("user-published", onMediaStreamPublished);
      rtcClient.on("user-unpublished", onMediaStreamUnpublished);
      rtcClient.on("user-left", onParticipantLeft);
      rtcClient.on("user-joined", (user) => { });

      await rtcClient.setClientRole("host");
      rtcClient.enableAudioVolumeIndicator();

      const mode = meetingConfig?.proxyMode ?? 0;
      if (mode !== 0 && !isNaN(parseInt(mode))) {
        rtcClient.startProxyServer(parseInt(mode));
      }

      if (meetingConfig.role === "audience") {
        rtcClient.setClientRole(meetingConfig.role, { level: meetingConfig.audienceLatency });
      } else if (meetingConfig.role === "host") {
        rtcClient.setClientRole(meetingConfig.role);
      }

      meetingConfig.uid = await rtcClient.join(
        meetingConfig.appid || "",
        meetingConfig.channel || "",
        meetingConfig.rtcToken || null,
        meetingConfig.uid || null
      );

      await initializeRealtimeMessaging(username!);

      const remoteUsers = rtcClient.remoteUsers;

      for (const user of remoteUsers) {
        if (user.hasVideo) {
          await rtcClient.subscribe(user, "video");
        }
        if (user.hasAudio) {
          await rtcClient.subscribe(user, "audio");
        }
      }

    } catch (error) {
      console.error("Error in connectToMeetingRoom:", error);
      throw error;
    }
  };

  const joinMeetingRoom = async () => {
    try {
      if (!meetingConfig) return;
      await connectToMeetingRoom();
      await subscribeToExistingParticipants();

      if (rtmChannel) {
        await rtmChannel.sendMessage({
          text: JSON.stringify({
            type: 'user-info',
            uid: meetingConfig.uid,
            name: username
          })
        });
      }

      if (localUserTrack) {
        const tracksToPublish = [];

        // Only publish audio track if microphone is enabled
        if (localUserTrack.audioTrack && isMicrophoneEnabled) {
          await localUserTrack.audioTrack.setEnabled(true);
          tracksToPublish.push(localUserTrack.audioTrack);
        }
        if (localUserTrack.videoTrack && isCameraEnabled) {
          await localUserTrack.videoTrack.setEnabled(true);
          tracksToPublish.push(localUserTrack.videoTrack);
        }

        if (tracksToPublish.length > 0) {
          await rtcClient.publish(tracksToPublish);
        }

        await broadcastCurrentMediaStates();
      }

      ensureRemoteAudioPlaying();

      AgoraRTC.setLogLevel(1);
      setHasJoinedMeeting(true);
      setMeetingStage("hasJoinedMeeting");
      setMeetingConfig(meetingConfig);
    } catch (error) {
      console.log("Error joining meeting:", error);
    }
  };

  const subscribeToParticipantMedia = async (user: any, mediaType: "audio" | "video") => {
    try {
      await rtcClient.subscribe(user, mediaType);
      const uid = String(user.uid);

      if (mediaType === "video") {
        const videoTrack = user.videoTrack;

        setRemoteParticipants((prevUsers) => {
          const existingUser = prevUsers[uid] || {
            name: "",
            rtcUid: uid,
            audioEnabled: false,
            videoEnabled: true
          };

          return {
            ...prevUsers,
            [uid]: {
              ...existingUser,
              videoTrack,
              videoEnabled: true,
              hasTrack: true
            },
          };
        });

        if (rtmChannel) {
          await rtmChannel.sendMessage({
            text: JSON.stringify({
              type: 'request-video-state',
              uid: meetingConfig.uid,
              targetUid: uid
            })
          });
          await rtmChannel.sendMessage({
            text: JSON.stringify({
              type: 'request-states',
              uid: meetingConfig.uid
            })
          });
        }
      }

      if (mediaType === "audio") {
        const audioTrack = user.audioTrack;
        setRemoteParticipants((prevUsers) => ({
          ...prevUsers,
          [uid]: {
            ...prevUsers[uid],
            audioTrack,
            audioEnabled: true
          },
        }));
        audioTrack.play();
      }
    } catch (error) {
      console.log(`Error subscribing to ${mediaType}:`, error);
    }
  };

  const checkAndRecoverSubscriptions = useCallback(async () => {
    if (!rtcClient) return;

    const remoteUsers = rtcClient.remoteUsers;
    const currentParticipants = { ...remoteParticipants };

    for (const user of remoteUsers) {
      const uid = String(user.uid);

      if (user.hasVideo && (!currentParticipants[uid]?.videoTrack || !currentParticipants[uid]?.hasVideo)) {
        try {
          await rtcClient.subscribe(user, 'video');
          setRemoteParticipants(prev => ({
            ...prev,
            [uid]: {
              ...prev[uid],
              videoTrack: user.videoTrack,
              videoEnabled: true,
              hasVideo: true
            }
          }));
        } catch (error) {
          console.error('Error recovering video subscription:', error);
        }
      }

      if (user.hasAudio && (!currentParticipants[uid]?.audioTrack || !currentParticipants[uid]?.hasAudio)) {
        try {
          await rtcClient.subscribe(user, 'audio');
          const audioTrack = user.audioTrack;
          if (audioTrack) {
            audioTrack.setVolume(100);
            await audioTrack.play();
            setRemoteParticipants(prev => ({
              ...prev,
              [uid]: {
                ...prev[uid],
                audioTrack,
                audioEnabled: true,
                hasAudio: true
              }
            }));
          }
        } catch (error) {
          console.error('Error recovering audio subscription:', error);
        }
      }
    }
  }, [remoteParticipants]);

  const leaveCall = useCallback(async () => {
    try {
      if (isSharingScreen === String(meetingConfig.uid)) {
        await handleEndScreenShare('end-screen-share', meetingConfig.uid as number);
      }

      await releaseMediaResources();

      if (rtmChannel) {
        await rtmChannel.leave();
        await rtmClient.logout();
      }

      if (rtcClient) {
        await rtcClient.leave();
        rtcClient.removeAllListeners();
      }

      if (rtcScreenShareClient) {
        await rtcScreenShareClient.leave();
        rtcScreenShareClient.removeAllListeners();
      }

      setHasJoinedMeeting(false);
      setIsSharingScreen(null);
      setScreenSharingUser(null);
      setRemoteParticipants({});
      setSpeakingParticipants({});
      setMeetingStage("prepRoom");

      rtmChannel = null as any;
      rtmClient = null as any;
      rtcClient = null as any;
      rtcScreenShareClient = null as any;

    } catch (error) {
      console.error("Error leaving call:", error);
    }
  }, [
    isSharingScreen,
    meetingConfig.uid,
    handleEndScreenShare,
    releaseMediaResources
  ]);

  const disconnectFromMessaging = useCallback(async () => {
    await leaveCall();
  }, [leaveCall]);

  useEffect(() => {
    window.addEventListener("beforeunload", disconnectFromMessaging);
    return () => {
      window.removeEventListener("beforeunload", disconnectFromMessaging);
    };
  }, [disconnectFromMessaging]);

  useEffect(() => {
    if (hasJoinedMeeting) {
      const recoveryInterval = setInterval(checkAndRecoverSubscriptions, 5000);
      return () => clearInterval(recoveryInterval);
    }
  }, [hasJoinedMeeting, checkAndRecoverSubscriptions]);

  useLayoutEffect(() => {
    if (videoRef.current !== null && localUserTrack && localUserTrack.videoTrack) {
      localUserTrack.videoTrack.play(videoRef.current, meetingConfig);
    }

    return () => {
      if (localUserTrack && localUserTrack.videoTrack) {
        localUserTrack.videoTrack.close();
      }
    };
  }, [localUserTrack, meetingConfig]);

  useLayoutEffect(() => {
    if (localUserTrack && localUserTrack.audioTrack) {
      localUserTrack.audioTrack.play();
    }

    return () => {
      if (localUserTrack && localUserTrack.audioTrack) {
        localUserTrack.audioTrack.stop();
      }
    };
  }, [localUserTrack]);

  useEffect(() => {
    return () => {
      if (rtmChannel) {
        rtmChannel.off("MemberLeft", onMemberDisconnected);
        rtmChannel.off("MemberJoined", onParticipantJoined);
      }
    };
  }, [onMemberDisconnected, onParticipantJoined]);

  return (
    <VideoConferencingContext.Provider
      value={{
        currentStep, setCurrentStep,
        meetingRoomId, setMeetingRoomId,
        isMicrophoneEnabled,
        isCameraEnabled,
        toggleMicrophone,
        toggleCamera,
        localUserTrack,
        meetingConfig,
        videoRef,
        initializeLocalMediaTracks,
        setLocalUserTrack,
        releaseMediaResources,
        joinMeetingRoom,
        publishLocalMediaTracks,
        setMeetingStage,
        meetingStage,
        setChannelName,
        channelName,
        remoteParticipants,
        hasJoinedMeeting,
        remoteUsersRef,
        setUsername,
        username,
        setHasJoinedMeeting,
        speakingParticipants,
        handleShareScreen,
        handleEndScreenShare,
        userIsHost,
        userIsCoHost,
        meetingRoomData,
        screenTrack,
        isSharingScreen,
        screenSharingUser,
        leaveCall
      }}>
      {children}
    </VideoConferencingContext.Provider>

  );
}

export function useVideoConferencing() {
  const context = useContext(VideoConferencingContext);
  if (context === undefined) {
    throw new Error('useVideoConferencing must be used within a VideoProvider');
  }
  return context;
}