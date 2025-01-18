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
  screenSharingUser: any
}

let rtcClient: IAgoraRTCClient;
let rtmClient: RtmClient;
let rtmChannel: RtmChannel;
let rtcScreenShareClient: IAgoraRTCClient;

const VideoConferencingContext = createContext<VideoConferencingContextContextType | undefined>(undefined);

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
  const [isSharingScreen, setIsSharingScreen] = useState<string | null>(null); // Store uid of sharing user
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

  useEffect(() => {
    rateLimiter.startResetTimer();
    return () => rateLimiter.stopResetTimer();
  }, []);

  // Add this to your VideoConferencingContext
  const trackCallDuration = () => {
    const startTime = Date.now();
    const participants = Object.keys(remoteParticipants || {}).length + 1;

    // Track when call ends
    return () => {
      const duration = (Date.now() - startTime) / 1000 / 60; // in minutes
      const totalMinutes = duration * participants; // multiply by number of participants
      console.log(`Call used approximately ${totalMinutes} minutes`);
    };
  };

  // Use it when joining/leaving calls
  useEffect(() => {
    const cleanup = trackCallDuration();
    return cleanup;
  }, [hasJoinedMeeting]);

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

  useEffect(() => {
    remoteUsersRef.current = remoteParticipants;
  }, [remoteParticipants, remoteUsersRef]);

  useEffect(() => {
    remoteScreenShareParticipantsRef.current = remoteScreenShareParticipants;
  }, [remoteScreenShareParticipants]);

  const fetchMeetingRoomData = async () => {
    try {
      const data = await agoraGetAppData(channelName);
      setMeetingRoomData(data.data);
      handleMeetingHostAndCohost();
    } catch (error) {
      console.log("Error fetching meeting room data:", error);
    }
  };

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
  }, [channelName, username]);

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
          await sendRateLimitedMessage({
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

  const handleEndScreenShare = async (action: string, uid: number) => {
    await handleScreenTrackEnd();
    if (rtmChannel) {
      await sendRateLimitedMessage({
        text: JSON.stringify({
          command: action,
          uid,
          type: 'screen-share-state',
          isSharing: false
        })
      });
    }
  };

  const handleScreenTrackEnd = async () => {
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
      await sendRateLimitedMessage({
        text: JSON.stringify({
          type: 'screen-share-state',
          uid: meetingConfig.uid,
          isSharing: false
        })
      });
    }
  };

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
      // Clean up existing tracks
      if (localUserTrack?.videoTrack) {
        localUserTrack.videoTrack.stop();
        await localUserTrack.videoTrack.close();
      }
      if (localUserTrack?.audioTrack) {
        localUserTrack.audioTrack.stop();
        await localUserTrack.audioTrack.close();
      }

      // Optimize video settings based on participant count
      const participants = Object.keys(remoteParticipants || {}).length;
      const videoConfig = {
        encoderConfig: {
          width: participants > 2 ? 480 : 640,
          height: participants > 2 ? 360 : 480,
          frameRate: participants > 2 ? 15 : 24,
          bitrateMin: participants > 2 ? 200 : 400,
          bitrateMax: participants > 2 ? 800 : 1000,
        }
      };

      const audioConfig = {
        encoderConfig: "speech_standard", // Changed from music_standard for better performance
        AEC: true,  // Echo Cancellation
        ANS: true,  // Noise Suppression
        AGC: true   // Auto Gain Control
      } as any;

      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(audioConfig),
        AgoraRTC.createCameraVideoTrack(videoConfig)
      ]);

      await audioTrack.setEnabled(isMicrophoneEnabled);
      await videoTrack.setEnabled(isCameraEnabled);

      setLocalUserTrack({
        audioTrack,
        videoTrack,
        screenTrack: null,
      });

    } catch (error) {
      console.error("Error configuring media tracks:", error);
    }
  };

  // Update video quality when participants change
  useEffect(() => {
    const participantCount = Object.keys(remoteParticipants || {}).length;
    if (localUserTrack?.videoTrack && participantCount > 0) {
      const newConfig = {
        width: participantCount > 2 ? 480 : 640,
        height: participantCount > 2 ? 360 : 480,
        frameRate: participantCount > 2 ? 15 : 24,
        bitrateMin: participantCount > 2 ? 200 : 400,
        bitrateMax: participantCount > 2 ? 800 : 1000,
      };

      localUserTrack.videoTrack.setEncoderConfiguration(newConfig);
    }
  }, [remoteParticipants, localUserTrack]);

  const releaseMediaResources = async () => {
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
  };

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

  const broadcastCurrentMediaStates = async () => {
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
  };

  const onParticipantJoined = async (memberId: string) => {
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
        await sendRateLimitedMessage({
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
  };

  const initializeRealtimeMessaging = async (name: string) => {
    try {
      rtmClient = AgoraRTM.createInstance(meetingConfig.appid!);
      const sanitizedUid = String(meetingConfig.uid).replace(/[^a-zA-Z0-9]/g, '');

      await rtmClient.login({
        uid: sanitizedUid,
        token: meetingConfig.rtmToken!,
      });

      const channel = rtmClient.createChannel(meetingConfig.channel!);
      rtmChannel = channel;
      await channel.join();

      await rtmClient.addOrUpdateLocalUserAttributes({
        name: name.slice(0, 64),
        userRtcUid: sanitizedUid,
      });

      await channel.sendMessage({
        text: JSON.stringify({
          type: 'user-info',
          uid: sanitizedUid,
          name: name,
        })
      });

      await fetchActiveMeetingParticipants();

      window.addEventListener("beforeunload", disconnectFromMessaging);
      channel.on("MemberJoined", onParticipantJoined);
      channel.on("MemberLeft", onMemberDisconnected);
      channel.on("ChannelMessage", async ({ text, peerId }: any) => {
        try {
          const message = JSON.parse(text);
          const uid = String(message.uid).replace(/[^a-zA-Z0-9]/g, '');
          switch (message.type) {
            case 'request-states':
              if (Number(message.uid) !== Number(meetingConfig.uid)) {
                await broadcastCurrentMediaStates();
              }
              break;
            case 'user-info':
              setRemoteParticipants(prevUsers => {
                const updatedUser = {
                  ...prevUsers[uid],
                  name: message.name,
                  rtcUid: uid,
                  videoTrack: prevUsers[uid]?.videoTrack,
                  audioTrack: prevUsers[uid]?.audioTrack,
                  audioEnabled: prevUsers[uid]?.audioEnabled ?? false,
                  videoEnabled: prevUsers[uid]?.videoEnabled ?? false,
                };
                return {
                  ...prevUsers,
                  [uid]: updatedUser,
                };
              });

              if (rtmChannel && uid !== String(meetingConfig.uid)) {
                await sendRateLimitedMessage({
                  text: JSON.stringify({
                    type: 'user-info',
                    uid: meetingConfig.uid,
                    name: username
                  })
                });
              }
              break;
            case 'video-state':
              setRemoteParticipants(prevUsers => {
                const existingUser = prevUsers[uid] || {
                  name: "",
                  rtcUid: uid,
                  audioEnabled: false,
                  videoEnabled: false,
                  videoTrack: null
                };

                return {
                  ...prevUsers,
                  [uid]: {
                    ...existingUser,
                    videoEnabled: message.enabled,
                    videoTrack: existingUser.videoTrack
                  }
                };
              });
              break;
            case 'request-video-state':
              if (message.targetUid === String(meetingConfig.uid)) {
                await sendRateLimitedMessage({
                  text: JSON.stringify({
                    type: 'video-state',
                    uid: meetingConfig.uid,
                    enabled: isCameraEnabled
                  })
                });
              }
              break;
            case 'audio-state':
              setRemoteParticipants(prevUsers => {
                const newState = {
                  ...prevUsers,
                  [uid]: {
                    ...prevUsers[uid],
                    audioEnabled: message.enabled,
                    audioTrack: prevUsers[uid]?.audioTrack
                  },
                };
                return newState;
              });
              break;
            case 'speaking-state':
              setSpeakingParticipants(prev => ({
                ...prev,
                [uid]: message.isSpeaking
              }));
              break;
            case 'screen-share-state':
              if (message.isSharing) {
                setIsSharingScreen(String(message.uid));
                setScreenSharingUser({
                  uid: String(message.uid),
                  isLocal: false
                });
              } else {
                setIsSharingScreen(null);
                setScreenSharingUser(null);
              }
              break;

          }
        } catch (error) {
          console.log("Error processing channel message:", error);
        }
      });

    } catch (error) {
      console.log("Error in initializeRealtimeMessaging:", error);
      throw error;
    }
  };

  const onMediaStreamPublished = async (user: any, mediaType: "audio" | "video") => {
    try {
      await rtcClient.subscribe(user, mediaType);
      const uid = String(user.uid);

      if (mediaType === "video") {
        if (!user.videoTrack?.isScreenTrack) {
          setRemoteParticipants((prevUsers) => {
            const existingUser = prevUsers[uid] || {
              name: "",
              rtcUid: uid,
              audioEnabled: false,
              videoEnabled: false
            };

            const newState = {
              ...prevUsers,
              [uid]: {
                ...existingUser,
                videoTrack: user.videoTrack,
                videoEnabled: true,
                hasVideo: true
              }
            };
            return newState;
          });
        }
      }

      if (mediaType === "audio") {
        const audioTrack = user.audioTrack;

        setRemoteParticipants((prevUsers) => {
          const existingUser = prevUsers[uid] || {
            name: "",
            rtcUid: uid,
            videoEnabled: false,
            audioEnabled: false
          };

          return {
            ...prevUsers,
            [uid]: {
              ...existingUser,
              audioTrack,
              audioEnabled: true,
              hasAudio: true
            }
          };
        });

        if (audioTrack) {
          audioTrack.setVolume(100);
          await audioTrack.play();
        }
      }

    } catch (error) {
      console.error("[STREAM-ERROR] Error in onMediaStreamPublished:", error);
    }
  };

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

  const onMediaStreamUnpublished = async (user: any, mediaType: "audio" | "video") => {
    const uid = String(user.uid);

    if (mediaType === "video" && user.videoTrack?.isScreenTrack) {
      setRemoteParticipants((prevUsers) => ({
        ...prevUsers,
        [uid]: {
          ...prevUsers[uid],
          screenVideoTrack: null,
          isScreenSharing: false
        },
      }));

      // Clear screen sharing state if this user was sharing
      if (isSharingScreen === uid) {
        setIsSharingScreen(null);
        setScreenSharingUser(null);
      }
    } else {
      setRemoteParticipants((prevUsers) => ({
        ...prevUsers,
        [uid]: {
          ...prevUsers[uid],
          ...(mediaType === 'audio' ? {
            audioTrack: null,
            audioEnabled: false
          } : {
            videoEnabled: false
          })
        },
      }));
    }
    await rtcClient.unsubscribe(user, mediaType);
  };

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

  const onParticipantLeft = async (user: any, reason: any) => {
    const uid = String(user.uid);
    setSpeakingParticipants(prev => {
      const updated = { ...prev };
      delete updated[uid];
      return updated;
    });
    const updatedUsers = { ...remoteUsersRef.current };
    delete updatedUsers[uid];
    remoteUsersRef.current = updatedUsers;
    setRemoteParticipants(updatedUsers);
  };

  const disconnectFromMessaging = async () => {
    setIsSharingScreen(null);
    setScreenSharingUser(null);
    await rtmChannel.leave();
    await rtmClient.logout();
    (rtmChannel as any) = null;
  };

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

  const onMemberDisconnected = async () => {
  };

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

  const setupNetworkOptimization = async () => {
    try {
      if (!rtcClient) return;

      // Enable dual stream mode for better bandwidth management
      await rtcClient.enableDualStream();

      // Set low stream parameters for when network is poor
      await rtcClient.setLowStreamParameter({
        width: 320,
        height: 180,
        framerate: 15,
        bitrate: 200
      });

      // Set up stream fallback options when new users join
      rtcClient.on("user-joined", async (user) => {
        // Set fallback option for this specific user
        // 0 = No fallback
        // 1 = Audio only when network is poor
        // 2 = Low quality stream when network is poor
        await rtcClient.setStreamFallbackOption(user.uid, 1);
      });

    } catch (error) {
      console.error("Error setting up network optimization:", error);
    }
  };

  const connectToMeetingRoom = async () => {
    try {
      rtcClient = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      // Client configuration
      // rtcClient.setClientRole("host");
      rtcClient.enableAudioVolumeIndicator();

      // Enable dual stream
      await rtcClient.enableDualStream();

      // Set default fallback option for all remote users
      rtcClient.on("user-published", async (user) => {
        try {
          // Set fallback option for each remote user
          await rtcClient.setStreamFallbackOption(user.uid, 2);
          // 0: Disable fallback
          // 1: Only subscribe to audio when network conditions are poor
          // 2: Subscribe to low-quality stream when network conditions are poor
        } catch (error) {
          console.error("Error setting fallback option:", error);
        }
      });

      // Rest of your connection code...
      const joinedUid = await rtcClient.join(
        meetingConfig.appid || "",
        meetingConfig.channel || "",
        meetingConfig.rtcToken || null,
        meetingConfig.uid || null
      );

      // Set fallback option for local stream
      if (joinedUid) {
        await rtcClient.setStreamFallbackOption(joinedUid, 2);
      }

      meetingConfig.uid = joinedUid;

    } catch (error) {
      console.error("Error in connectToMeetingRoom:", error);
      throw error;
    }
  };

  // Add cleanup for network resources
  const cleanupNetworkResources = async () => {
    if (rtcClient) {
      try {
        await rtcClient.disableDualStream();
        rtcClient.removeAllListeners();
      } catch (error) {
        console.error("Error cleaning up network resources:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      cleanupNetworkResources();
    };
  }, []);

  const joinMeetingRoom = async () => {
    try {
      if (!meetingConfig) return;
      await connectToMeetingRoom();
      await subscribeToExistingParticipants();

      if (rtmChannel) {
        await sendRateLimitedMessage({
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
          await sendRateLimitedMessage({
            text: JSON.stringify({
              type: 'request-video-state',
              uid: meetingConfig.uid,
              targetUid: uid
            })
          });
          await sendRateLimitedMessage({
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

  const checkAndRecoverSubscriptions = async () => {
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
  };

  useEffect(() => {
    if (hasJoinedMeeting) {
      const recoveryInterval = setInterval(checkAndRecoverSubscriptions, 5000);
      return () => clearInterval(recoveryInterval);
    }
  }, [hasJoinedMeeting]);

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