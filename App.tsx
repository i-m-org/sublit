import React, { useState, useCallback } from 'react';
import { 
  Smartphone, 
  Download, 
  Upload, 
  RotateCw,
  RefreshCcw,
  Settings2,
  AlertCircle,
  ImageIcon,
  X
} from 'lucide-react';

import { DeviceButton, SliderControl, DevicePreview } from './src/components';
import { useImageUpload, useDrag } from './src/hooks';
import { exportDesign } from './src/utils/canvas';
import { DeviceTemplate, ImageConfig } from './src/types';
import { DEVICE_TEMPLATES, SCALE_CONFIG, DEFAULT_IMAGE_CONFIG } from './src/constants';

const App: React.FC = () => {
  // ---------- ESTADOS ----------
  const [selectedTemplate, setSelectedTemplate] = useState<DeviceTemplate>(DEVICE_TEMPLATES[0]);
  const [error, setError] = useState<string | null>(null);
  const [imageConfig, setImageConfig] = useState<ImageConfig>(DEFAULT_IMAGE_CONFIG);

  const { pxPerMm, minScale, maxScale, scaleStep } = SCALE_CONFIG;

  // ---------- HOOKS PERSONALIZADOS ----------
  const {
    image,
    fileInputRef,
    handleImageUpload: processImageUpload,
    handleRemoveImage,
    handleResetPosition,
  } = useImageUpload({
    selectedTemplate,
    onError: setError,
  });

  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDrag({
    image,
    imageConfig,
    setImageConfig,
  });

  // ---------- HANDLERS ----------

  // Cambiar escala
  const handleScaleChange = useCallback((scale: number) => {
    setImageConfig(prev => ({ ...prev, scale }));
  }, []);

  // Rotar imagen
  const handleRotationChange = useCallback((increment: number) => {
    setImageConfig(prev => ({
      ...prev,
      rotation: (prev.rotation + increment) % 360
    }));
  }, []);

  // Manejar carga de imagen
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processImageUpload(e);
    // Ocultar error después de 3 segundos
    setTimeout(() => setError(null), 3000);
  }, [processImageUpload]);

  // Eliminar imagen
  const handleRemove = useCallback(() => {
    handleRemoveImage();
    setImageConfig(DEFAULT_IMAGE_CONFIG);
  }, [handleRemoveImage]);

  // Exportar diseño
  const handleExport = useCallback(() => {
    exportDesign({
      device: selectedTemplate,
      image,
      imageConfig,
    });
  }, [selectedTemplate, image, imageConfig]);

  // Dimensiones del dispositivo
  const deviceWidth = selectedTemplate.width * pxPerMm;
  const deviceHeight = selectedTemplate.height * pxPerMm;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 lg:p-10 font-sans">
      {/* ---------- HEADER ---------- */}
      <header className="max-w-7xl mx-auto mb-8 lg:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Smartphone className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              <span className="text-blue-500">SUBLIME</span>
              <span className="text-white">TAL</span>
              <span className="text-blue-500 text-lg ml-1">PRO</span>
            </h1>
            <p className="text-neutral-500 text-sm">Simulador de impresión de alta precisión</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/svg+xml" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="bg-white text-black font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Upload size={18} /> 
            <span className="hidden sm:inline">SUBIR DISEÑO</span>
          </button>
          <button 
            onClick={handleExport}
            disabled={!image}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} /> 
            <span className="hidden sm:inline">EXPORTAR</span>
          </button>
        </div>
      </header>

      {/* ---------- MENSAJE DE ERROR ---------- */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* ---------- PANEL LATERAL ---------- */}
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          
          {/* Selector de dispositivo */}
          <div className="bg-neutral-900 border border-neutral-800 p-5 lg:p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Smartphone size={16} /> Seleccionar Placa
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {DEVICE_TEMPLATES.map(t => (
                <DeviceButton 
                  key={t.id} 
                  device={t}
                  isSelected={selectedTemplate.id === t.id}
                  onClick={() => setSelectedTemplate(t)}
                />
              ))}
            </div>
          </div>

          {/* Controles de imagen */}
          <div className="bg-neutral-900 border border-neutral-800 p-5 lg:p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Settings2 size={16} /> Ajuste de Imagen
            </h3>
            
            {image ? (
              <div className="space-y-5">
                {/* Control de escala */}
                <SliderControl
                  label="Escala"
                  value={imageConfig.scale}
                  min={minScale}
                  max={maxScale}
                  step={scaleStep}
                  onChange={handleScaleChange}
                  icon={RefreshCcw}
                  formatValue={(v) => `${(v * 100).toFixed(1)}%`}
                />

                {/* Botones de rotación */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400 flex items-center gap-2">
                    <RotateCw size={14} /> Rotación
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRotationChange(-90)}
                      className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCw size={16} className="rotate-180" />
                      -90°
                    </button>
                    <button
                      onClick={() => handleRotationChange(90)}
                      className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCw size={16} />
                      +90°
                    </button>
                  </div>
                </div>

                {/* Reset y quitar */}
                <div className="flex gap-2 pt-2 border-t border-neutral-800">
                  <button
                    onClick={handleResetPosition}
                    className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={16} />
                    Reset
                  </button>
                  <button
                    onClick={handleRemove}
                    className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Quitar
                  </button>
                </div>

                {/* Info de la imagen */}
                <div className="pt-3 border-t border-neutral-800">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-2">Información</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-neutral-800/50 p-2 rounded-lg">
                      <span className="text-neutral-500">Ancho</span>
                      <p className="font-mono text-neutral-300">{image.width}px</p>
                    </div>
                    <div className="bg-neutral-800/50 p-2 rounded-lg">
                      <span className="text-neutral-500">Alto</span>
                      <p className="font-mono text-neutral-300">{image.height}px</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-neutral-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="text-neutral-600" size={28} />
                </div>
                <p className="text-neutral-600 text-sm mb-3">Sube una imagen para comenzar</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Seleccionar archivo
                </button>
              </div>
            )}
          </div>

          {/* Nota informativa */}
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-200/70 leading-relaxed">
              <strong className="text-amber-400">Nota:</strong> El área negra representa el hueco de la cámara. Asegúrate de que el contenido principal (rostros, logos) no quede bajo esa zona.
            </p>
          </div>
        </div>

        {/* ---------- VISOR PRINCIPAL ---------- */}
        <div className="lg:col-span-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[3rem] p-6 lg:p-10 flex flex-col items-center justify-center min-h-[500px] lg:min-h-[650px] relative overflow-hidden">
            
            {/* Fondo de cuadrícula */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
              }} 
            />

            {/* Componente DevicePreview */}
            <DevicePreview
              device={selectedTemplate}
              image={image}
              imageConfig={imageConfig}
              isDragging={isDragging}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />

            {/* Información del dispositivo */}
            <div className="mt-6 lg:mt-8 text-center">
              <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-3">
                Vista Previa de Placa de Metal
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1.5 bg-neutral-800 rounded-full text-[10px] text-neutral-400 font-mono">
                  {selectedTemplate.name}
                </span>
                <span className="px-3 py-1.5 bg-neutral-800 rounded-full text-[10px] text-neutral-400 font-mono">
                  W: {selectedTemplate.width}mm
                </span>
                <span className="px-3 py-1.5 bg-neutral-800 rounded-full text-[10px] text-neutral-400 font-mono">
                  H: {selectedTemplate.height}mm
                </span>
                {image && (
                  <span className="px-3 py-1.5 bg-blue-500/20 rounded-full text-[10px] text-blue-400 font-mono">
                    300 DPI
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="max-w-7xl mx-auto mt-10 pt-6 border-t border-neutral-800 text-center">
        <p className="text-neutral-600 text-xs">
          SUBLIMETAL PRO © 2024 — Simulador de impresión para sublimación en metal
        </p>
      </footer>
    </div>
  );
};

export default App;
