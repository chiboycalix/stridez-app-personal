import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type IconButtonProps = {
  leftIcon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftClick?: (e?: any) => void;
  showDivider?: boolean;
  onRightClick?: (e?: any) => void;
  iconClass?: string;
  className?: string;
  tooltip?: string;
  rightTooltip?: string;
};

const IconButton = ({
  leftIcon,
  onLeftClick,
  iconClass,
  showDivider = false,
  onRightClick,
  rightIcon,
  className,
  tooltip,
  rightTooltip
}: IconButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center rounded-lg shadow-sm border border-gray-200 group transition-colors",
        isHovered || isRightHovered ? "bg-black" : "bg-white",
        className
      )}
    >
      <div className="relative">
        {tooltip && isHovered && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-2 rounded whitespace-nowrap">
            {tooltip}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLeftClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isHovered || isRightHovered ? "text-white hover:bg-gray-800" : "text-black hover:bg-gray-50",
            iconClass
          )}
        >
          {leftIcon}
        </motion.button>
      </div>

      {showDivider && (
        <>
          <div className={cn(
            "h-6 w-px transition-colors",
            isHovered || isRightHovered ? "bg-gray-700" : "bg-gray-200"
          )} />
          <div className="relative">
            {rightTooltip && isRightHovered && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-2 rounded whitespace-nowrap">
                {rightTooltip}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRightClick}
              onMouseEnter={() => setIsRightHovered(true)}
              onMouseLeave={() => setIsRightHovered(false)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isHovered || isRightHovered ? "text-white hover:bg-gray-800" : "text-black hover:bg-gray-50",
                iconClass
              )}
            >
              {rightIcon ? rightIcon : <MoreVertical size={20} />}
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default IconButton;