import React from 'react'
import { ParticipantVideo } from './VideoGrid';

const DesktopView = ({ participants }: any) => {
  const count = participants.length;

  if (count === 1) {
    return (
      <div className="h-full w-full flex items-center justify-center p-2 sm:p-4">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <ParticipantVideo participant={participants[0]} />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="h-full w-full flex items-center justify-center p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          {participants.map((participant: any) => (
            <div key={participant.uid} className="w-full sm:w-1/2 h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
              <ParticipantVideo participant={participant} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2 sm:p-4">
      <div className="sm:hidden h-full overflow-y-auto">
        <div className="flex flex-col gap-2">
          {participants.map((participant: any) => (
            <div key={participant.uid} className="w-full h-[250px] flex-shrink-0">
              <ParticipantVideo participant={participant} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block h-full">
        <div className={`h-full ${count > 6 ? 'overflow-y-auto' : ''}`}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {participants.map((participant: any) => (
              <div key={participant.uid}>
                <ParticipantVideo participant={participant} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopView