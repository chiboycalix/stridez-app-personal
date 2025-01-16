import { MoreVertical, PinIcon } from 'lucide-react';
import React from 'react'

type Message = {
  id: string;
  user: {
    name: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number }[];
};

const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className="space-y-1">
      {message.isPinned && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <PinIcon className="w-3 h-3" />
          <span>PINNED</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm text-white">
          {message.user.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-gray-200 text-sm">{message.user.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{message.timestamp}</span>
              <button className="text-gray-400 hover:text-gray-300">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-300 break-words text-sm">{message.content}</p>
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {message.reactions.map((reaction, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-800 rounded-full px-2 py-1">
                  <span>{reaction.emoji}</span>
                  <span className="text-sm text-gray-400">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage