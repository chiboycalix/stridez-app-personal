import AgoraRTC, { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import React, { useState, useEffect, useCallback, useRef } from "react";

import { motion } from 'framer-motion';

interface MicSelectProps {
  audioTrack?: IMicrophoneAudioTrack;
  setHandleSelectMicrophone: (value: boolean) => void;
}

interface MicrophoneItem {
  label: string;
  value: string;
  deviceId: string;
}


const MicSelect = ({ audioTrack, setHandleSelectMicrophone }: MicSelectProps) => {
  const [items, setItems] = useState<MicrophoneItem[]>([
    {
      label: "Default",
      value: "default",
      deviceId: "",
    },
  ]);
  const [curValue, setCurValue] = useState<string>("default")
  const popupRef = useRef<HTMLDivElement>(null);

  const handleMicrophoneChange = useCallback(
    async (changedDevice: { state: string; device: { deviceId: string; label: string } }) => {
      const devices = await AgoraRTC.getMicrophones();
      setItems(
        devices.map((item) => ({
          label: item.label,
          value: item.deviceId,
          deviceId: item.deviceId,
        }))
      );

      if (audioTrack) {
        if (changedDevice.state === "ACTIVE") {
          // When plugging in a device, switch to a device that is newly plugged in.
          await audioTrack.setDevice(changedDevice.device.deviceId);
          setCurValue(audioTrack.getTrackLabel() || "default");
        } else if (changedDevice.device.label === curValue) {
          // Switch to an existing device when the current device is unplugged.
          if (devices[0]) {
            await audioTrack.setDevice(devices[0].deviceId);
            setCurValue(audioTrack.getTrackLabel() || "default");
          }
        }
      }
    },
    [audioTrack, curValue]
  );

  useEffect(() => {
    AgoraRTC.onMicrophoneChanged = handleMicrophoneChange;

    return () => {
      // Clean up the event listener when the component unmounts
      // AgoraRTC.onMicrophoneChanged = null;
    };
  }, [handleMicrophoneChange]);

  useEffect(() => {
    if (audioTrack) {
      const label = audioTrack.getTrackLabel();
      setCurValue(label || "default");

      AgoraRTC.getMicrophones().then((mics) => {
        setItems(
          mics.map((item) => ({
            label: item.label,
            value: item.deviceId,
            deviceId: item.deviceId,
          }))
        );
      });
    }
  }, [audioTrack]);

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = items.find((item) => item.value === e.target.value);
    if (target) {
      setCurValue(target.value);
      if (audioTrack) {
        // Switch device of the local audio track.
        await audioTrack.setDevice(target.deviceId);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setHandleSelectMicrophone(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      ref={popupRef}
      className='overflow-hidden w-9/12 rounded-md shadow-lg mt-4 border border-gray-100 absolute top-8 left-0 z-[100]'
    >
      {items.map((item) => (
        <div
          key={item.deviceId}
          className='bg-[#1C1C1E]'
          onClick={async () => {
            setCurValue(item.value);
            if (audioTrack && item.deviceId) {
              await audioTrack.setDevice(item.deviceId);
            }
            setHandleSelectMicrophone(false)
          }}
        >
          <p className='flex text-sm p-2 py-3 items-center gap-2 cursor-pointer rounded-sm hover:bg-[#272A31] text-white'>
            {item.label}
          </p>
        </div>
      ))}
    </motion.div>
  )
}

export default MicSelect