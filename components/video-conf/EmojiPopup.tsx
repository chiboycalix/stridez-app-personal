import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EmojiPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  anchorRect?: DOMRect | null;
};

const EmojiPopup = ({ isOpen, onClose, onEmojiSelect, anchorRect }: EmojiPopupProps) => {
  if (!anchorRect) return null;

  const emojis = [
    { emoji: '👌', label: 'ok hand' },
    { emoji: '🤓', label: 'nerd face' },
    { emoji: '👏', label: 'clapping hands' },
    { emoji: '🔥', label: 'fire' },
    { emoji: '🎉', label: 'party popper' },
    { emoji: '😍', label: 'heart eyes' },
    { emoji: '😂', label: 'joy' },
    { emoji: '😮', label: 'wow' },
  ];

  // Calculate position
  const menuPosition = {
    bottom: window.innerHeight - anchorRect.top + 35,
    right: window.innerWidth - anchorRect.right - 90,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150]"
          />

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
            className="z-[200] bg-[#1A1C1D] rounded-lg shadow-lg p-3 border border-gray-800"
          >
            <div className="grid grid-cols-4 gap-2">
              {emojis.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onEmojiSelect(item.emoji);
                    onClose();
                  }}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label={item.label}
                >
                  <span className="text-xl">{item.emoji}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmojiPopup;