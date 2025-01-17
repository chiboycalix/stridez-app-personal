import React from 'react';
import { MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  return (
    <div
      className={cn(
        "flex items-center rounded-lg shadow-sm border border-gray-700 group transition-colors hover:bg-black",
        className
      )}
    >
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLeftClick}
              className={cn(
                "p-2 rounded-lg transition-colors text-white",
                "group-hover:text-white hover:bg-gray-800",
                iconClass
              )}
            >
              {leftIcon}
            </motion.button>
          </TooltipTrigger>
          {tooltip && (
            <TooltipContent side="top" align="center">
              <p>{tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {showDivider && (
        <>
          <div className="h-6 w-px bg-gray-200 group-hover:bg-gray-700" />

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRightClick}
                  className={cn(
                    "p-2 rounded-lg transition-colors text-white",
                    "group-hover:text-white hover:bg-gray-800",
                    iconClass
                  )}
                >
                  {rightIcon ? rightIcon : <MoreVertical size={20} />}
                </motion.button>
              </TooltipTrigger>
              {rightTooltip && (
                <TooltipContent side="top" align="center">
                  <p>{rightTooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};

export default IconButton;