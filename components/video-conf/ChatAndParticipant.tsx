import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import Input from '@/components/ui/Input';
import { ChevronRight, Search, Send, Smile, Users, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ChatEmpty } from '@/public/assets';
import ParticipantList from './ParticipantList';
import { useVideoConferencing } from '@/context/VideoConferencingContext';

const ChatAndParticipant = ({ onClose, localUser, remoteParticipants }: {
  onClose: () => void;
  localUser: any;
  remoteParticipants: any
}) => {
  const { chatMessages, sendChatMessage, username } = useVideoConferencing();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const remoteUsersArray = Object.entries(remoteParticipants || {}).map(([uid, user]: any) => ({
    ...user,
    uid
  }));

  const allParticipants = [
    { ...localUser, isLocal: true },
    ...remoteUsersArray
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    await sendChatMessage(messageInput, 'text');
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute right-0 top-0 h-full w-full md:w-96 bg-[#11131A]"
    >
      <div className="h-full flex flex-col">
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
                        Chat
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

                {/* Chat Content */}
                <TabsContent value="questions" className="h-[calc(100vh-15rem)]">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 text-gray-400">
                          <div className="mb-6">
                            <Image src={ChatEmpty} alt="ChatEmpty" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
                          <p className="text-sm text-gray-500">
                            There are no messages here yet. Start the conversation by sending a message.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 space-y-6">
                          {chatMessages.map((message) => (
                            <ChatMessage
                              key={message.id}
                              message={{
                                id: message.id,
                                user: {
                                  name: message.sender.name,
                                  initials: message.sender.name.substring(0, 2).toUpperCase()
                                },
                                content: message.content,
                                timestamp: new Date(message.timestamp).toLocaleTimeString(),
                                isLocal: message.isLocal
                              }}
                            />
                          ))}
                          <div ref={messagesEndRef} />
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
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Send a message..."
                          className="w-full bg-gray-800 text-white rounded-md px-4 py-3 pr-20 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                            <Smile className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleSendMessage}
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
                          >
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
                        placeholder="Find what you're looking for"
                        className='rounded-sm bg-[#191B23] text-[#8F9099]'
                        leftIcon={<Search />}
                        leftIconClassName='text-white'
                        rightIcon={<Search />}
                        rightIconClassName="hidden"
                      />
                    </div>
                    <div className="space-y-4">
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
  );
};

export default ChatAndParticipant;