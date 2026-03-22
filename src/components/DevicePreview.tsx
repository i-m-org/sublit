import React from 'react';
import { DeviceTemplate, ImageConfig } from '../types';
import { SCALE_CONFIG } from '../constants';

interface DevicePreviewProps {
  device: DeviceTemplate;
  image: HTMLImageElement | null;
  imageConfig: ImageConfig;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onImageClick?: (x: number, y: number) => void;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  device,
  image,
  imageConfig,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onImageClick,
}) => {
  const { pxPerMm } = SCALE_CONFIG;
  const deviceWidth = device.width * pxPerMm;
  const deviceHeight = device.height * pxPerMm;

  return (
    <div 
      className="relative shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden select-none"
      style={{
        width: `${deviceWidth}px`,
        height: `${deviceHeight}px`,
        borderRadius: `${device.cornerRadius * pxPerMm}px`,
        cursor: image ? (isDragging ? 'grabbing' : 'grab') : 'default',
        maxWidth: '100%',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Capa 1: Fondo blanco de la placa */}
      <div className="absolute inset-0 bg-white" />

      {/* Capa 2: Diseño del usuario */}
      {image && (
        <div 
          className="absolute pointer-events-none origin-top-left"
          style={{
            transform: `translate(${imageConfig.x}px, ${imageConfig.y}px) scale(${imageConfig.scale}) rotate(${imageConfig.rotation}deg) scaleX(${imageConfig.flipH ? -1 : 1}) scaleY(${imageConfig.flipV ? -1 : 1})`,
          }}
        >
          <img 
            src={image.src} 
            alt="Diseño de sublimación" 
            className="max-w-none shadow-sm pointer-events-auto cursor-crosshair"
            draggable={false}
            onClick={(e) => {
              if (onImageClick) {
                const rect = e.currentTarget.getBoundingClientRect();
                // Calcular posición del clic relativa a la imagen dibujada
                // Primero obtenemos la posición del clic en pixels del canvas
                const clickXRaw = e.clientX - rect.left;
                const clickYRaw = e.clientY - rect.top;
                
                // Convertir a coordenadas de la imagen considerando transformaciones
                // La imagen está en: translate(x, y) scale(scale) rotate(rotation)
                // Necesitamos invertir esta transformación
                const imgWidth = image.width * imageConfig.scale;
                const imgHeight = image.height * imageConfig.scale;
                
                // Calcular el centro de la imagen
                const centerX = imageConfig.x + imgWidth / 2;
                const centerY = imageConfig.y + imgHeight / 2;
                
                // Coordenadas relativas al centro de la imagen
                const relX = clickXRaw - centerX;
                const relY = clickYRaw - centerY;
                
                // Aplicar rotación inversa para obtener coordenadas en el espacio de la imagen
                const angleRad = -imageConfig.rotation * Math.PI / 180;
                const rotatedX = relX * Math.cos(angleRad) - relY * Math.sin(angleRad);
                const rotatedY = relX * Math.sin(angleRad) + relY * Math.cos(angleRad);
                
                // Centrar en la imagen original y convertir a coordenadas de la imagen sin escala
                const focusX = (rotatedX / imageConfig.scale) + (image.width / 2);
                const focusY = (rotatedY / imageConfig.scale) + (image.height / 2);
                
                onImageClick(focusX, focusY);
              }
            }}
          />
        </div>
      )}

      {/* Capa 3: Hueco de la cámara */}
      <div 
        className="absolute bg-black/85 flex items-center justify-center border border-white/20 backdrop-blur-sm"
        style={{
          left: `${device.camera.x * pxPerMm}px`,
          top: `${device.camera.y * pxPerMm}px`,
          width: `${device.camera.w * pxPerMm}px`,
          height: `${device.camera.h * pxPerMm}px`,
          borderRadius: `${device.camera.r * pxPerMm}px`,
          zIndex: 10,
        }}
      >
        <span className="text-[7px] font-bold text-neutral-500 uppercase tracking-wider">CÁMARA</span>
      </div>

      {/* Capa 4: Brillo metálico */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};

export default DevicePreview;
