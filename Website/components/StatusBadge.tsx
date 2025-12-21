'use client';

import { motion } from "framer-motion";

interface StatusBadgeProps {
  status: 'stopped' | 'starting' | 'running';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isRunning = status === 'running';
  const isStarting = status === 'starting';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const getStatusClasses = () => {
    if (isRunning) {
      return 'bg-green-500/20 text-green-400';
    }
    if (isStarting) {
      return 'bg-yellow-500/20 text-yellow-400';
    }
    return 'bg-red-500/20 text-red-400';
  };

  const getDisplayText = () => {
    if (status === 'running') return 'Running';
    if (status === 'starting') return 'Starting';
    return 'Stopped';
  };

  return (
    <motion.span
      className={`${sizeClasses[size]} rounded font-medium ${getStatusClasses()}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        ...(isStarting && {
          opacity: [1, 0.7, 1],
        }),
      }}
      transition={{
        duration: isStarting ? 1.5 : 0.2,
        repeat: isStarting ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      {getDisplayText()}
    </motion.span>
  );
}

