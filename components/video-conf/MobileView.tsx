import React from 'react'
import { ParticipantVideo } from './VideoGrid'

const MobileView = ({ visibleParticipants }: any) => {
  return (
    <div className="h-full w-full p-2 sm:p-4">
      <div className="grid grid-cols-2 gap-2">
        {visibleParticipants.map((participant: any) => (
          <div key={participant.uid} className="w-[150px] h-[150px]">
            <ParticipantVideo participant={participant} customClasses="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileView