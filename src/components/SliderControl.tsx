import React from 'react';
import { Maximize2 } from 'lucide-react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  icon?: React.ComponentType<{ size?: number }>;
  formatValue?: (value: number) => string;
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
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-neutral-400 flex items-center gap-2">
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
      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors"
    />
  </div>
);

export default SliderControl;
