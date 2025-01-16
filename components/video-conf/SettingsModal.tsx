import React, { useState } from 'react'
import { Bell, Mic, Volume2, X, VideoIcon, MessageSquareIcon, HandIcon, StopCircleIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal'
import Input from '@/components/ui/Input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'devices' | 'notifications';


const DeviceSettingsView = () => (
  <div className="space-y-8">
    <div className="w-full">
      <Input
        label={(<span className='text-white'>Video</span>)}
        variant='select'
        dropdownClass="bg-[#27272A] border-none"
        dropdownItemClass="hover:bg-[#27272A] hover:rounded-lg"
        selectTextClass="text-white"
        className='bg-[#272A31] border-none'

        options={[
          {
            value: "Select Camera",
            label: (<div className='flex items-center gap-4'>
              <VideoIcon className="h-5 w-5" />
              <p>Facetime HD Camera</p>
            </div>)
          }
        ]}
      />
    </div>
    <div className="w-full">
      <Input
        variant='select'
        label={(<span className='text-white'>Microphone</span>)}
        dropdownClass="bg-[#27272A] border-none"
        dropdownItemClass="hover:bg-[#27272A] hover:rounded-lg"
        selectTextClass="text-white"
        className='bg-[#272A31] border-none'

        options={[
          {
            value: "Select Microphone",
            label: (<div className='flex items-center gap-4'>
              <Mic className="h-5 w-5" />
              <p>Default - Macbook Pro Mic (Built-in)</p>
            </div>)
          }
        ]}
      />
    </div>
    <div className='w-full flex items-end justify-between gap-2'>
      <div className='basis-10/12'>
        <Input
          variant='select'
          label={(<span className='text-white'>Speakers</span>)}
          dropdownClass="bg-[#27272A] border-none"
          dropdownItemClass="hover:bg-[#27272A] hover:rounded-lg"
          selectTextClass="text-white"
          className='bg-[#272A31] border-none'

          options={[
            {
              value: "Select Speaker",
              label: (<div className='flex items-center gap-4'>
                <Volume2 className="h-5 w-5" />
                <p>Default - Macbook Pro Mic (Built-in)</p>
              </div>)
            }
          ]}
        />
      </div>

      <div className='flex-1'>
        <Button variant="secondary" className='bg-[#444954] flex items-center gap-1 w-full'>
          <Volume2 />
          <span>Test</span>
        </Button>
      </div>
    </div>
  </div>
);

const NotificationsView = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-2 justify-between">
      <div className='flex items-center gap-2'>
        <MessageSquareIcon />
        <Label htmlFor="airplane-mode">Whiteboard</Label>
      </div>
      <Switch id="airplane-mode" />
    </div>

    <div className="flex items-center space-x-2 justify-between">
      <div className='flex items-center gap-2'>
        <MessageSquareIcon />
        <Label htmlFor="airplane-mode">New Question</Label>
      </div>
      <Switch id="airplane-mode" />
    </div>

    <div className="flex items-center space-x-2 justify-between">
      <div className='flex items-center gap-2'>
        <HandIcon />
        <Label htmlFor="airplane-mode">Request to join</Label>
      </div>
      <Switch id="airplane-mode" className='bg-primary-900' />
    </div>

    <div className="flex items-center space-x-2 justify-between">
      <div className='flex items-center gap-2'>
        <StopCircleIcon />
        <Label htmlFor="airplane-mode">Error</Label>
      </div>
      <Switch id="airplane-mode" />
    </div>


  </div>
);

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [currentView, setCurrentView] = useState<View>('devices');

  if (!isOpen) return null;
  return (
    <Modal>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 flex items-center justify-center p-4 rounded-lg"
      >

        <div className="w-full max-w-3xl bg-[#1C1C1E] text-white rounded-lg">
          <div className="flex rounded-lg">
            <div className="w-64 p-6 bg-[#0D0D0F] rounded-l-lg">
              <h1 className="text-2xl font-semibold mb-6">Settings</h1>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 ${currentView === 'devices' ? 'bg-[#27272A] text-white' : 'text-white/70'
                    }`}
                  onClick={() => setCurrentView('devices')}
                >
                  <Settings className="h-5 w-5" />
                  Device Settings
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 ${currentView === 'notifications' ? 'bg-[#27272A] text-white' : 'text-white/70'
                    }`}
                  onClick={() => setCurrentView('notifications')}
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6 pb-40">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {currentView === 'devices' ? 'Device Settings' : 'Notifications'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentView === 'devices' ? <DeviceSettingsView /> : <NotificationsView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </Modal>
  )
}

export default SettingsModal