import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
    id: string;
    user: {
      name: string;
      initials: string;
    };
    content: string;
    timestamp: string;
    isLocal?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={cn(
      "flex gap-3",
      message.isLocal && "flex-row-reverse"
    )}>
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
          {message.user.initials}
        </div>
      </div>
      <div className={cn(
        "flex flex-col",
        message.isLocal && "items-end"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">
            {message.isLocal ? 'You' : message.user.name}
          </span>
          <span className="text-xs text-gray-400">{message.timestamp}</span>
        </div>
        <div className={cn(
          "max-w-[90%] rounded-lg px-4 py-2 text-sm",
          message.isLocal
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-100"
        )}>
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;