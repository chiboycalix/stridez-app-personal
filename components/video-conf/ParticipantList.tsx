import React from 'react';
import { MoreVertical, Crown, UserRoundX, UserRoundPlus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ParticipantList = ({ allParticipants }: any) => {
  return (
    <div className="space-y-4">
      {[...allParticipants].map((applicant, index) => {
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">P{index + 1}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {applicant.isLocal ? "You" : `${applicant.name || `User ${index + 1}`}`}
                </p>
                <p className="text-gray-400 text-xs">Viewer</p>
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-44 p-0 bg-gray-800 border-gray-700 z-[200]"
                align="end"
                side="bottom"
                sideOffset={5}
              >
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      console.log('Make host clicked');
                    }}
                  >
                    <Crown className="w-4 h-4" />
                    <span>Make Host</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      console.log('Remove clicked');
                    }}
                  >
                    <UserRoundX className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      console.log('Make co-host clicked');
                    }}
                  >
                    <UserRoundPlus className="w-4 h-4" />
                    <span>Make Co-host</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantList;