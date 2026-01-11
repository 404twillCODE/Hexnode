'use client';

import { motion } from 'framer-motion';

interface InlineSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function InlineSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  disabled = false,
  readOnly = false,
}: InlineSliderProps) {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-sm font-semibold text-foreground">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      
      {readOnly ? (
        <div className="h-2 bg-foreground/10 rounded-lg">
          <div
            className="h-full bg-accent rounded-lg transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : (
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}


