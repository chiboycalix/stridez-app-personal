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

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
};

type CallOptionsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  setShowInvitePeople: (showInvite: boolean) => void;
};

const CallOptionsMenu = ({ isOpen, onClose, anchorRect, setShowInvitePeople }: CallOptionsMenuProps) => {
  if (!anchorRect) return null;

  const menuPosition = {
    bottom: window.innerHeight - anchorRect.top + 40,
    right: window.innerWidth - anchorRect.right + 20,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: <UserPlus className="w-4 h-4" />,
      label: 'Invite User',
      onClick: () => {
        setShowInvitePeople(true);
        onClose();
      }
    },
    {
      icon: <ArrowLeft className="w-4 h-4" />,
      label: 'Be Right Back',
      shortcut: 'BRB',
      onClick: () => {
        onClose();
      }
    },
    {
      icon: <MonitorPlay className="w-4 h-4" />,
      label: 'Enable Picture-in-Picture',
      onClick: async () => {
        try {
          const video = document.querySelector('video');
          if (video && document.pictureInPictureEnabled) {
            await video.requestPictureInPicture();
          }
        } catch (err) {
          console.error('PiP failed:', err);
        }
        onClose();
      }
    },
    {
      icon: (
        <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">W</span>
        </div>
      ),
      label: 'Share to Whatsapp',
      onClick: () => {
        const shareUrl = encodeURIComponent(window.location.href);
        window.open(`https://wa.me/?text=${shareUrl}`, '_blank');
        onClose();
      }
    },
    {
      icon: (
        <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">X</span>
        </div>
      ),
      label: 'Share to X',
      onClick: () => {
        const shareUrl = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Join my meeting!');
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`, '_blank');
        onClose();
      }
    },
    {
      icon: <Link className="w-4 h-4" />,
      label: 'Copy link',
      onClick: () => {
        handleCopyLink();
        onClose();
      }
    },
    {
      icon: <Maximize2 className="w-4 h-4" />,
      label: 'Go Fullscreen',
      onClick: () => {
        toggleFullscreen();
        onClose();
      }
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Settings',
      onClick: () => {
        // Handle settings
        onClose();
      }
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
                onClick={item.onClick}
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