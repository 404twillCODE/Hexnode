'use client';

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition } from "@/components/motionVariants";

interface RamSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  totalPool: number;
  currentlyUsed: number;
  isEditing?: boolean;
  currentServerRam?: number; // Current server RAM in MB (for editing mode)
}

export default function RamSlider({
  value,
  onChange,
  min,
  max,
  totalPool,
  currentlyUsed,
  isEditing = false,
  currentServerRam = 0,
}: RamSliderProps) {
  // Calculate available pool RAM (in MB)
  const availablePoolRam = (totalPool - currentlyUsed);
  
  // In editing mode, remaining after change = available + current server RAM - new value
  // In create mode, remaining after change = available - new value
  const remainingAfterChange = isEditing
    ? availablePoolRam + currentServerRam - value
    : availablePoolRam - value;
  
  const isMax = value === max;
  const valueInGB = value / 1024;
  const remainingAfterGB = remainingAfterChange / 1024;
  
  // Check if the current value would exceed the pool
  const wouldExceedPool = remainingAfterChange < 0;

  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={fadeUp}
      transition={fadeUpTransition}
    >
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">
          RAM Allocation
        </label>
        <span className="text-sm text-muted">
          Allocating: {valueInGB.toFixed(2)} GB
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={256}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-accent"
          style={{
            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((value - min) / (max - min)) * 100}%, rgba(255, 255, 255, 0.1) ${((value - min) / (max - min)) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
          }}
        />
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted">
            {isEditing ? 'Remaining pool RAM after change:' : 'Available pool RAM after creation:'}
          </span>
          <span className={wouldExceedPool ? 'text-red-400 font-medium' : 'text-foreground font-medium'}>
            {remainingAfterGB.toFixed(2)} GB
          </span>
        </div>
        {isEditing && (
          <div className="flex justify-between items-center text-xs text-muted">
            <span>Available pool RAM:</span>
            <span>{availablePoolRam / 1024} GB</span>
          </div>
        )}
      </div>
      {wouldExceedPool && (
        <motion.p
          className="text-sm text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          This allocation would exceed your resource pool.
        </motion.p>
      )}
      {isMax && !wouldExceedPool && (
        <motion.p
          className="text-sm text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isEditing 
            ? 'This will use all available pool RAM plus the current server allocation.'
            : 'This will use all remaining available RAM.'}
        </motion.p>
      )}
    </motion.div>
  );
}

