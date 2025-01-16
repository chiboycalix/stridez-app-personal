import React, { useState, useEffect } from 'react';

// State management hook for volume levels
export const useVolumeLevels = () => {
  const [volumeLevels, setVolumeLevels] = useState({});

  const updateVolumeMeter = (uid: any, level: number) => {
    setVolumeLevels(prev => ({
      ...prev,
      [uid]: level
    }));

    // Clear the volume level after 300ms of no updates
    // This mimics Google Meet's behavior
    setTimeout(() => {
      setVolumeLevels(prev => ({
        ...prev,
        [uid]: 0
      }));
    }, 300);
  };

  return { volumeLevels, updateVolumeMeter } as any;
};

export const VolumeIndicator = ({ level }: any) => {
  // Google Meet uses 3 bars that light up based on volume
  const getBarOpacity = (barIndex: number) => {
    if (level < 33 && barIndex > 0) return 'opacity-20';
    if (level < 66 && barIndex > 1) return 'opacity-20';
    return 'opacity-100';
  };

  return (
    <div className="flex gap-1 items-end h-4">
      <div
        className={`w-1 h-2 bg-green-500 rounded-sm transition-opacity duration-150 ${getBarOpacity(0)}`}
      />
      <div
        className={`w-1 h-3 bg-green-500 rounded-sm transition-opacity duration-150 ${getBarOpacity(1)}`}
      />
      <div
        className={`w-1 h-4 bg-green-500 rounded-sm transition-opacity duration-150 ${getBarOpacity(2)}`}
      />
    </div>
  );
};