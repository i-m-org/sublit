import { useState, useCallback, useEffect } from 'react';
import { ImageConfig, Position } from '../types';

interface UseDragProps {
  image: HTMLImageElement | null;
  imageConfig: ImageConfig;
  setImageConfig: React.Dispatch<React.SetStateAction<ImageConfig>>;
}

interface UseDragReturn {
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

export const useDrag = ({ 
  image, 
  imageConfig, 
  setImageConfig 
}: UseDragProps): UseDragReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!image) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - imageConfig.x, 
      y: e.clientY - imageConfig.y 
    });
  }, [image, imageConfig.x, imageConfig.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setImageConfig(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  }, [isDragging, dragStart, setImageConfig]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Efecto para eventos globales del mouse
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useDrag;
