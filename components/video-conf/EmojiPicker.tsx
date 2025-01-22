import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  emojiPickerAnchorRect: DOMRect | null;
  onEmojiSelect: (emoji: string) => void;
}

const emojis = [
  '😊', '😂', '🥳', '👍', '❤️', '🎉',
  '👋', '🤔', '👏', '🙌', '🔥', '✨',
  '💯', '🎸', '🌟', '💪', '🤝', '👌',
  '😎', '🥰', '😄', '🤗', '😅', '🙂'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onClose, emojiPickerAnchorRect, onEmojiSelect }) => {
  if (!emojiPickerAnchorRect) return null;

  const menuPosition = {
    bottom: window.innerHeight - emojiPickerAnchorRect.top + 10,
    right: window.innerWidth - emojiPickerAnchorRect.right + 10,
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

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

          {/* Emoji Picker */}
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
            className="z-50 w-64 bg-[#1A1C1D] rounded-lg shadow-lg p-3 border border-gray-800"
          >
            <div className="grid grid-cols-6 gap-1.5">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="hover:bg-gray-800 p-2 rounded-lg transition-colors text-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmojiPicker;