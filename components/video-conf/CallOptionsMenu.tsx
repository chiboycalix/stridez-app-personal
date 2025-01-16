import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  ArrowLeft,
  MonitorPlay,
  Link,
  Maximize2,
  Settings,
} from 'lucide-react';

type CallOptionsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
};

const CallOptionsMenu = ({ isOpen, onClose, anchorRect }: CallOptionsMenuProps) => {
  if (!anchorRect) return null;

  const menuPosition = {
    bottom: window.innerHeight - anchorRect.top + 40,
    right: window.innerWidth - anchorRect.right + 20,
  };

  const menuItems = [
    {
      icon: <UserPlus className="w-4 h-4" />,
      label: 'Pending request to join (1)',
    },
    {
      icon: <ArrowLeft className="w-4 h-4" />,
      label: 'Be Right Back',
      shortcut: 'BRB'
    },
    {
      icon: <MonitorPlay className="w-4 h-4" />,
      label: 'Enable Picture-in-Picture',
    },
    {
      icon: (
        <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">W</span>
        </div>
      ),
      label: 'Share to Whatsapp',
    },
    {
      icon: (
        <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">X</span>
        </div>
      ),
      label: 'Share to X',
    },
    {
      icon: <Link className="w-4 h-4" />,
      label: 'Copy link',
    },
    {
      icon: <Maximize2 className="w-4 h-4" />,
      label: 'Go Fullscreen',
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Settings',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              bottom: menuPosition.bottom,
              right: menuPosition.right,
              transformOrigin: 'bottom right'
            }}
            className="z-50 w-64 bg-[#1A1C1D] rounded-lg shadow-lg py-1 border border-gray-800"
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={onClose}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left"
              >
                <span className="text-gray-400">{item.icon}</span>
                <span className="flex-1 text-sm text-gray-200">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-500">{item.shortcut}</span>
                )}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CallOptionsMenu;