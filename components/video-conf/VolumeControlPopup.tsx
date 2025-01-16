import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Star, Volume2 } from 'lucide-react';

type VolumeControlProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
};

const VolumeControlPopup = ({ isOpen, onClose, anchorRect }: VolumeControlProps) => {
  if (!anchorRect) return null;

  const menuPosition = {
    bottom: window.innerHeight - anchorRect.top + 10,
    right: window.innerWidth - anchorRect.right + 14,
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
            className="fixed inset-0 z-[150]"
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
            className="z-[200] w-64 bg-[#1A1C1D] rounded-lg shadow-lg py-2 border border-gray-800"
          >
            <div className="space-y-1">
              {/* Pin Tile Option */}
              <button
                onClick={() => { }}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-800 transition-colors"
              >
                <Pin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-200">Pin Tile for Myself</span>
              </button>

              {/* Spotlight Option */}
              <button
                onClick={() => { }}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-800 transition-colors"
              >
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-200">Spotlight for Everyone</span>
              </button>

              {/* Volume Control */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-200">Volume</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VolumeControlPopup;