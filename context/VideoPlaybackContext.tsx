"use client"

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface VideoPlaybackContextType {
  isGloballyPaused: boolean
  setIsGloballyPaused: Dispatch<SetStateAction<boolean>>
}

const VideoPlaybackContext = createContext<
  VideoPlaybackContextType | undefined
>(undefined)

interface VideoPlaybackProviderProps {
  children: ReactNode
}

export const VideoPlaybackProvider: React.FC<VideoPlaybackProviderProps> = ({
  children,
}) => {
  const [isGloballyPaused, setIsGloballyPaused] = useState<boolean>(false)

  return (
    <VideoPlaybackContext.Provider
      value={{ isGloballyPaused, setIsGloballyPaused }}
    >
      {children}
    </VideoPlaybackContext.Provider>
  )
}

export const useVideoPlayback = (): VideoPlaybackContextType => {
  const context = useContext(VideoPlaybackContext)

  if (!context) {
    throw new Error(
      'useVideoPlayback must be used within a VideoPlaybackProvider'
    )
  }

  return context
}
