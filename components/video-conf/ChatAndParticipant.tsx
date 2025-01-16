import React, { useState } from 'react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import Input from '@/components/ui/Input';
import { ChevronRight, Search, Send, Smile, Users, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ChatEmpty } from '@/public/assets';
import ParticipantList from './ParticipantList';

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
const ChatAndParticipant = ({ onClose, localUser, remoteParticipants }: { onClose: () => void; localUser: any; remoteParticipants: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: '1',
    //   user: { name: 'Karen A', initials: 'KA' },
    //   content: 'Can we discuss how the data is being provided to the clients on an "as is" and "where-is" basis.',
    //   timestamp: '2:12 PM',
    //   isPinned: true
    // },
    // {
    //   id: '2',
    //   user: { name: 'Karen A', initials: 'KA' },
    //   content: 'Thank you\nits clear enough now',
    //   timestamp: '2:12 PM',
    //   reactions: [{ emoji: '👍', count: 2 }]
    // },
    // {
    //   id: '3',
    //   user: { name: 'John D', initials: 'JD' },
    //   content: 'I have some concerns about the timeline. Can we review the project milestones?',
    //   timestamp: '2:15 PM'
    // },
    // {
    //   id: '4',
    //   user: { name: 'Sarah M', initials: 'SM' },
    //   content: 'The latest updates look promising. I particularly like the new features we discussed in the last meeting.',
    //   timestamp: '2:18 PM',
    //   reactions: [{ emoji: '🎉', count: 3 }]
    // },
    // {
    //   id: '5',
    //   user: { name: 'Karen A', initials: 'KA' },
    //   content: 'Lets schedule a follow-up meeting to address these points in detail.',
    //   timestamp: '2:20 PM'
    // },
    // {
    //   id: '6',
    //   user: { name: 'Mike R', initials: 'MR' },
    //   content: 'Has anyone reviewed the latest documentation? Ive added some important updates regarding the API changes.',
    //   timestamp: '2:25 PM'
    // },
    // {
    //   id: '7',
    //   user: { name: 'Emma L', initials: 'EL' },
    //   content: 'The QA team has completed the initial testing phase. Here are our findings...',
    //   timestamp: '2:30 PM',
    //   reactions: [{ emoji: '👀', count: 4 }]
    // },
    // {
    //   id: '8',
    //   user: { name: 'Karen A', initials: 'KA' },
    //   content: 'Great progress everyone! Lets make sure we document all these changes properly.',
    //   timestamp: '2:35 PM'
    // },
    // {
    //   id: '9',
    //   user: { name: 'John D', initials: 'JD' },
    //   content: 'Ill prepare a summary report by end of day.',
    //   timestamp: '2:38 PM',
    //   reactions: [{ emoji: '👍', count: 5 }]
    // },
    // {
    //   id: '10',
    //   user: { name: 'Sarah M', initials: 'SM' },
    //   content: 'Dont forget we have the client presentation tomorrow at 10 AM.',
    //   timestamp: '2:40 PM'
    // },
    // {
    //   id: '11',
    //   user: { name: 'Karen A', initials: 'KA' },
    //   content: 'Thanks for the reminder, Sarah. All materials are ready for review.',
    //   timestamp: '2:42 PM'
    // },
    // {
    //   id: '12',
    //   user: { name: 'Mike R', initials: 'MR' },
    //   content: 'Just pushed the latest code changes. Please review when you can.',
    //   timestamp: '2:45 PM',
    //   reactions: [{ emoji: '💻', count: 2 }]
    // }
  ]);

  const remoteUsersArray = Object.entries(remoteParticipants || {}).map(([uid, user]: any) => ({
    ...user,
    uid
  }));

  const allParticipants = [
    { ...localUser, isLocal: true },
    ...remoteUsersArray
  ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute right-0 top-0 h-full w-full md:w-96 bg-[#11131A]"
    >
      <div className="h-full flex flex-col">
        {/* Header with Tabs */}
        <div className="border-b border-[#191B23]">
          <div className="p-4">
            <div className="flex items-center justify-between w-full gap-4">
              <Tabs defaultValue="questions" className="w-full">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <TabsList className="bg-[#191B23] w-full">
                      <TabsTrigger
                        value="questions"
                        className="data-[state=active]:bg-[#272A31] data-[state=active]:text-white w-full"
                      >
                        Questions
                      </TabsTrigger>
                      <TabsTrigger
                        value="participants"
                        className="data-[state=active]:bg-[#272A31] data-[state=active]:text-white w-full"
                      >
                        Participants
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Questions Content */}
                <TabsContent value="questions" className="h-[calc(100vh-15rem)]">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 text-gray-400">
                          <div className="mb-6">
                            <Image src={ChatEmpty} alt="ChatEmpty" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
                          <p className="text-sm text-gray-500">
                            There are no Question here yet. Start engaging your participant by sending a message.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 space-y-6">
                          {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="px-0 py-1 rounded-md text-white text-sm flex items-center gap-2">
                          <span>To</span>
                          <div className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-sm cursor-pointer">
                            <div className="w-4 h-4 rounded-sm flex items-center justify-center">
                              <Users className="w-3 h-3" />
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm">Everyone</span>
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-2">
                        <input
                          placeholder="Send a message..."
                          className="w-full bg-gray-800 text-white rounded-md px-4 py-3 pr-20 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                            <Smile className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                            <Send className="w-5 h-5 rotate-45" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Participants Content */}
                <TabsContent value="participants" className="absolute left-0 right-0 bg-[#11131A] min-h-0 h-[calc(100vh-8rem)] overflow-y-auto">
                  <div className="p-4">
                    <div className='mb-6'>
                      <Input
                        variant='search'
                        placeholder='Find what you’re looking for'
                        className='rounded-sm bg-[#191B23] text-[#8F9099]'
                        leftIcon={<Search />}
                        leftIconClassName='text-white'
                        rightIcon={<Search />}
                        rightIconClassName="hidden"
                      />
                    </div>
                    <div className="space-y-4">
                      {/* Other Participants */}
                      <div className="space-y-4">
                        <ParticipantList allParticipants={allParticipants} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
};

export default ChatAndParticipant;
