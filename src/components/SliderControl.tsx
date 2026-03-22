import React from 'react';
import { Maximize2, LucideIcon } from 'lucide-react';
import { ThemeId } from '../types';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  icon?: LucideIcon;
  formatValue?: (value: number) => string;
  theme?: ThemeId;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  icon: Icon = Maximize2,
  formatValue,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`text-xs font-medium flex items-center gap-2 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
          <Icon size={14} />
          {label}
        </label>
        <span className="text-xs text-blue-400 font-mono">
          {formatValue ? formatValue(value) : value.toFixed(3)}
        </span>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors ${
          isDark ? 'bg-neutral-800' : 'bg-gray-200'
        }`}
      />
    </div>
  );
};

export default SliderControl;
