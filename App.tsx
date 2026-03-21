import React, { useState, useCallback, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Upload, 
  FlipHorizontal,
  FlipVertical,
  RefreshCcw,
  Settings2,
  AlertCircle,
  ImageIcon,
  X,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
  Move
} from 'lucide-react';

import { DeviceButton, SliderControl, DevicePreview } from './src/components';
import { useImageUpload, useDrag } from './src/hooks';
import { exportDesign } from './src/utils/canvas';
import { DeviceTemplate, ImageConfig } from './src/types';
import { DEVICE_TEMPLATES, SCALE_CONFIG, DEFAULT_IMAGE_CONFIG, THEMES, ThemeId, DEFAULT_THEME } from './src/constants';

const STORAGE_KEY = 'sublimetal-pro-state';

interface StoredState {
  selectedTemplateId: string;
  imageConfig: ImageConfig;
  theme: ThemeId;
}

const App: React.FC = () => {
  // ---------- ESTADOS ----------
  const [selectedTemplate, setSelectedTemplate] = useState<DeviceTemplate>(DEVICE_TEMPLATES[0]);
  const [error, setError] = useState<string | null>(null);
  const [imageConfig, setImageConfig] = useState<ImageConfig>(DEFAULT_IMAGE_CONFIG);
  
  // Estado para menú colapsable
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  // Estado para tema
  const [theme, setTheme] = useState<ThemeId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredState;
        return (parsed.theme as ThemeId) || DEFAULT_THEME;
      } catch {
        return DEFAULT_THEME;
      }
    }
    return DEFAULT_THEME;
  });

  // Estado para saber si la imagen ha sido movida por el usuario
  const [hasUserMovedImage, setHasUserMovedImage] = useState(false);

  const { pxPerMm, minScale, maxScale, scaleStep } = SCALE_CONFIG;
  const currentTheme = THEMES[theme];

  // ---------- CARGAR ESTADO DESDE LOCALSTORAGE ----------
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredState;
        const template = DEVICE_TEMPLATES.find(t => t.id === parsed.selectedTemplateId);
        if (template) {
          setSelectedTemplate(template);
          if (parsed.imageConfig) {
            setImageConfig(parsed.imageConfig);
            setHasUserMovedImage(true);
          }
        }
      } catch (e) {
        console.error('Error loading stored state:', e);
      }
    }
  }, []);

  // ---------- GUARDAR ESTADO EN LOCALSTORAGE ----------
  useEffect(() => {
    const state: StoredState = {
      selectedTemplateId: selectedTemplate.id,
      imageConfig,
      theme,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [selectedTemplate.id, imageConfig, theme]);

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
    onDragStart: () => setHasUserMovedImage(true),
  });

  // ---------- HANDLERS ----------

  // Cambiar escala
  const handleScaleChange = useCallback((scale: number) => {
    setImageConfig(prev => ({ ...prev, scale }));
  }, []);

  // Voltear imagen horizontalmente
  const handleFlipHorizontal = useCallback(() => {
    if (!image) {
      setError('Sube una imagen primero');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setImageConfig(prev => ({
      ...prev,
      flipH: !prev.flipH
    }));
  }, [image]);

  // Voltear imagen verticalmente
  const handleFlipVertical = useCallback(() => {
    if (!image) {
      setError('Sube una imagen primero');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setImageConfig(prev => ({
      ...prev,
      flipV: !prev.flipV
    }));
  }, [image]);

  // Resetear transforms (rotación y flips)
  const handleResetTransforms = useCallback(() => {
    setImageConfig(prev => ({
      ...prev,
      rotation: 0,
      flipH: false,
      flipV: false
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
    setHasUserMovedImage(false);
  }, [handleRemoveImage]);

  // Cambiar dispositivo
  const handleDeviceChange = useCallback((template: DeviceTemplate) => {
    setSelectedTemplate(template);
  }, []);

  // Cambiar tema
  const handleThemeChange = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'white' : 'dark');
  }, []);

  // Alternar panel
  const togglePanel = useCallback(() => {
    setIsPanelOpen(prev => !prev);
  }, []);

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

  // Estilos dinámicos basados en tema
  const themeStyles = {
    bgPrimary: currentTheme.bgPrimary,
    bgSecondary: currentTheme.bgSecondary,
    bgTertiary: currentTheme.bgTertiary,
    textPrimary: currentTheme.textPrimary,
    textSecondary: currentTheme.textSecondary,
    border: currentTheme.border,
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-10 font-sans transition-colors duration-300"
      style={{ backgroundColor: themeStyles.bgPrimary, color: themeStyles.textPrimary }}
    >
      {/* ---------- HEADER ---------- */}
      <header className="max-w-7xl mx-auto mb-8 lg:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Smartphone className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              <span className="text-blue-500">SUBLIME</span>
              <span style={{ color: themeStyles.textPrimary }}>TAL</span>
              <span className="text-blue-500 text-lg ml-1">PRO</span>
            </h1>
            <p className="text-sm" style={{ color: themeStyles.textSecondary }}>Simulador de impresión de alta precisión</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Botón de tema */}
          <button 
            onClick={handleThemeChange}
            className="p-2.5 rounded-full hover:bg-opacity-20 transition-colors flex items-center gap-2"
            style={{ backgroundColor: theme === 'dark' ? '#262626' : '#e5e5e5', color: themeStyles.textPrimary }}
            title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
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

      <main className="max-w-7xl mx-auto grid gap-6 lg:gap-10" style={{ gridTemplateColumns: isPanelOpen ? '340px 1fr' : '0px 1fr' }}>
        {/* ---------- PANEL LATERAL COLAPSABLE ---------- */}
        <div 
          className={`transition-all duration-300 overflow-hidden ${isPanelOpen ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: isPanelOpen ? 'auto' : 0 }}
        >
          {isPanelOpen && (
            <div className="space-y-4 lg:space-y-6 w-[340px]">
              {/* Selector de dispositivo */}
              <div 
                className="border p-5 lg:p-6 rounded-3xl"
                style={{ backgroundColor: themeStyles.bgSecondary, borderColor: themeStyles.border }}
              >
                <h3 className="text-xs font-bold mb-4 uppercase tracking-widest flex items-center gap-2" style={{ color: themeStyles.textSecondary }}>
                  <Smartphone size={16} /> Seleccionar Placa
                </h3>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {DEVICE_TEMPLATES.map(t => (
                    <DeviceButton 
                      key={t.id} 
                      device={t}
                      isSelected={selectedTemplate.id === t.id}
                      onClick={() => handleDeviceChange(t)}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>

              {/* Controles de imagen */}
              <div 
                className="border p-5 lg:p-6 rounded-3xl"
                style={{ backgroundColor: themeStyles.bgSecondary, borderColor: themeStyles.border }}
              >
                <h3 className="text-xs font-bold mb-4 uppercase tracking-widest flex items-center gap-2" style={{ color: themeStyles.textSecondary }}>
                  <Settings2 size={16} /> Ajuste de Imagen
                </h3>
                
                {image ? (
                  <div className="space-y-5">
                    {/* Aviso de arrastre obligatorio */}
                    {!hasUserMovedImage && (
                      <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl flex items-center gap-2">
                        <Move className="text-blue-500 shrink-0" size={16} />
                        <p className="text-xs text-blue-400">
                          Arrastra la imagen para posicionarla en la placa
                        </p>
                      </div>
                    )}

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
                      theme={theme}
                    />

                    {/* Botones de Voltear (Flip) */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-2" style={{ color: themeStyles.textSecondary }}>
                        <FlipHorizontal size={14} /> Voltear
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={handleFlipHorizontal}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          style={{ 
                            backgroundColor: imageConfig.flipH ? '#3b82f6' : themeStyles.bgTertiary, 
                            color: imageConfig.flipH ? '#ffffff' : themeStyles.textPrimary 
                          }}
                        >
                          <FlipHorizontal size={16} />
                          Horizontal
                        </button>
                        <button
                          onClick={handleFlipVertical}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          style={{ 
                            backgroundColor: imageConfig.flipV ? '#3b82f6' : themeStyles.bgTertiary, 
                            color: imageConfig.flipV ? '#ffffff' : themeStyles.textPrimary 
                          }}
                        >
                          <FlipVertical size={16} />
                          Vertical
                        </button>
                      </div>
                    </div>

                    {/* Reset y quitar */}
                    <div className="flex gap-2 pt-2 border-t" style={{ borderColor: themeStyles.border }}>
                      <button
                        onClick={handleResetTransforms}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        style={{ backgroundColor: themeStyles.bgTertiary, color: themeStyles.textPrimary }}
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
                    <div className="pt-3 border-t" style={{ borderColor: themeStyles.border }}>
                      <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: themeStyles.textSecondary }}>Información</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: themeStyles.bgTertiary }}>
                          <span style={{ color: themeStyles.textSecondary }}>Ancho</span>
                          <p className="font-mono">{image.width}px</p>
                        </div>
                        <div className="p-2 rounded-lg" style={{ backgroundColor: themeStyles.bgTertiary }}>
                          <span style={{ color: themeStyles.textSecondary }}>Alto</span>
                          <p className="font-mono">{image.height}px</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: themeStyles.bgTertiary }}>
                      <ImageIcon style={{ color: themeStyles.textSecondary }} size={28} />
                    </div>
                    <p className="text-sm mb-3" style={{ color: themeStyles.textSecondary }}>Sube una imagen para comenzar</p>
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
                <p className="text-xs leading-relaxed" style={{ color: theme === 'dark' ? '#fde68a' : '#b45309' }}>
                  <strong className="text-amber-400">Nota:</strong> El área negra representa el hueco de la cámara. Asegúrate de que el contenido principal (rostros, logos) no quede bajo esa zona.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------- BOTÓN PARA COLAPSAR PANEL ---------- */}
        <button
          onClick={togglePanel}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: themeStyles.bgSecondary, 
            border: `1px solid ${themeStyles.border}`,
            left: isPanelOpen ? '350px' : '20px'
          }}
          title={isPanelOpen ? 'Ocultar panel' : 'Mostrar panel'}
        >
          {isPanelOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
        </button>

        {/* ---------- VISOR PRINCIPAL ---------- */}
        <div 
          className="border rounded-[3rem] p-6 lg:p-10 flex flex-col items-center justify-center min-h-[500px] lg:min-h-[650px] relative overflow-hidden transition-colors duration-300"
          style={{ 
            backgroundColor: themeStyles.bgSecondary, 
            borderColor: themeStyles.border 
          }}
        >
          {/* Fondo de cuadrícula */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
              backgroundSize: '20px 20px',
              opacity: theme === 'dark' ? 0.1 : 0.15
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
            theme={theme}
          />

          {/* Información del dispositivo */}
          <div className="mt-6 lg:mt-8 text-center">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: themeStyles.textSecondary }}>
              Vista Previa de Placa de Metal
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1.5 rounded-full text-[10px] font-mono" style={{ backgroundColor: themeStyles.bgTertiary, color: themeStyles.textSecondary }}>
                {selectedTemplate.name}
              </span>
              <span className="px-3 py-1.5 rounded-full text-[10px] font-mono" style={{ backgroundColor: themeStyles.bgTertiary, color: themeStyles.textSecondary }}>
                W: {selectedTemplate.width}mm
              </span>
              <span className="px-3 py-1.5 rounded-full text-[10px] font-mono" style={{ backgroundColor: themeStyles.bgTertiary, color: themeStyles.textSecondary }}>
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
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="max-w-7xl mx-auto mt-10 pt-6 text-center" style={{ borderColor: themeStyles.border, borderTopWidth: 1, borderStyle: 'solid' }}>
        <p className="text-xs" style={{ color: themeStyles.textSecondary }}>
          SUBLIMETAL PRO © 2024 — Simulador de impresión para sublimación en metal
        </p>
      </footer>
    </div>
  );
};

export default App;
