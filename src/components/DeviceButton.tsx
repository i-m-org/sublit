import React from 'react';
import { DeviceTemplate } from '../types';

interface DeviceButtonProps {
  device: DeviceTemplate;
  isSelected: boolean;
  onClick: () => void;
}

export const DeviceButton: React.FC<DeviceButtonProps> = ({ 
  device, 
  isSelected, 
  onClick 
}) => (
  <button 
    onClick={onClick}
    className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 w-full ${
      isSelected 
        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
        : 'border-neutral-800 bg-neutral-800/40 hover:border-neutral-600 hover:bg-neutral-800/60'
    }`}
  >
    <div className="flex items-center justify-between mb-1">
      <p className="font-bold text-sm">{device.name}</p>
      {device.brand && (
        <span className="text-[10px] px-2 py-0.5 bg-neutral-700 rounded-full text-neutral-400">
          {device.brand}
        </span>
      )}
    </div>
    <p className="text-xs text-neutral-500">{device.width}×{device.height}mm</p>
  </button>
);

export default DeviceButton;
