import React from 'react';
import { DeviceTemplate, ThemeId } from '../types';

interface DeviceButtonProps {
  device: DeviceTemplate;
  isSelected: boolean;
  onClick: () => void;
  theme?: ThemeId;
}

export const DeviceButton: React.FC<DeviceButtonProps> = ({ 
  device, 
  isSelected, 
  onClick,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  
  return (
    <button 
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 w-full ${
        isSelected 
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
          : isDark 
            ? 'border-neutral-800 bg-neutral-800/40 hover:border-neutral-600 hover:bg-neutral-800/60'
            : 'border-gray-200 bg-gray-100/50 hover:border-gray-300 hover:bg-gray-100/80'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{device.name}</p>
        {device.brand && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-neutral-700 text-neutral-400' : 'bg-gray-200 text-gray-600'}`}>
            {device.brand}
          </span>
        )}
      </div>
      <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{device.width}×{device.height}mm</p>
    </button>
  );
};

export default DeviceButton;
