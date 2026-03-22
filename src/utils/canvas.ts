import { ImageConfig, DeviceTemplate } from '../types';
import { SCALE_CONFIG } from '../constants';

interface ExportOptions {
  device: DeviceTemplate;
  image: HTMLImageElement | null;
  imageConfig: ImageConfig;
}

// Genera canvas para impresión (solo diseño del usuario sobre fondo blanco)
export const generatePrintCanvas = ({ device, image, imageConfig }: ExportOptions): HTMLCanvasElement => {
  const { pxPerMm, printScale } = SCALE_CONFIG;
  
  const canvas = document.createElement('canvas');
  canvas.width = device.width * printScale;
  canvas.height = device.height * printScale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

  // Fondo blanco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (image) {
    const ratio = printScale / pxPerMm;
    
    ctx.save();
    
    // Calcular centro de rotación
    const imgWidth = image.width * imageConfig.scale;
    const imgHeight = image.height * imageConfig.scale;
    const centerX = (imageConfig.x + imgWidth / 2) * ratio;
    const centerY = (imageConfig.y + imgHeight / 2) * ratio;
    
    // Aplicar rotación
    ctx.translate(centerX, centerY);
    ctx.rotate((imageConfig.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Aplicar flip
    if (imageConfig.flipH || imageConfig.flipV) {
      ctx.translate(centerX, centerY);
      ctx.scale(imageConfig.flipH ? -1 : 1, imageConfig.flipV ? -1 : 1);
      ctx.translate(-centerX, -centerY);
    }
    
    // Dibujar imagen
    ctx.drawImage(
      image, 
      imageConfig.x * ratio, 
      imageConfig.y * ratio,
      imgWidth * ratio,
      imgHeight * ratio
    );
    
    ctx.restore();
  }

  return canvas;
};

// Genera canvas con preview (diseño + marco del dispositivo + hueco cámara)
// Exporta a 300 PPI con medidas reales del modelo + 3mm de gracia
export const generatePreviewCanvas = ({ device, image, imageConfig }: ExportOptions): HTMLCanvasElement => {
  const { pxPerMm } = SCALE_CONFIG;
  
  // 300 PPI = 11.81 px/mm
  const PPI_300 = 11.81;
  
  // Añadir 3mm de gracia
  const graceMm = 3;
  
  // Dimensiones totales con gracia (ancho + 2*gracia, alto + 2*gracia)
  const totalWidthMm = device.width + graceMm * 2;
  const totalHeightMm = device.height + graceMm * 2;
  
  const canvas = document.createElement('canvas');
  
  // Canvas a 300 PPI con medidas reales + 3mm de gracia
  canvas.width = Math.round(totalWidthMm * PPI_300);
  canvas.height = Math.round(totalHeightMm * PPI_300);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

  // Fondo blanco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calcular escala para dibujar en el canvas de 300 PPI
  const scale = PPI_300;
  const margin = graceMm * scale; // Margen de 3mm
  
  // Dibujar diseño del usuario centrado en el canvas
  if (image) {
    ctx.save();
    
    // Calcular centro de rotación
    const imgWidth = image.width * imageConfig.scale * (scale / pxPerMm);
    const imgHeight = image.height * imageConfig.scale * (scale / pxPerMm);
    
    // El diseño del usuario se dibuja en las coordenadas reales del dispositivo
    // Relacionado al margen de gracia
    const designX = imageConfig.x * scale + margin;
    const designY = imageConfig.y * scale + margin;
    const centerX = designX + imgWidth / 2;
    const centerY = designY + imgHeight / 2;
    
    // Aplicar rotación
    ctx.translate(centerX, centerY);
    ctx.rotate((imageConfig.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Aplicar flip
    if (imageConfig.flipH || imageConfig.flipV) {
      ctx.translate(centerX, centerY);
      ctx.scale(imageConfig.flipH ? -1 : 1, imageConfig.flipV ? -1 : 1);
      ctx.translate(-centerX, -centerY);
    }
    
    // Dibujar imagen
    ctx.drawImage(
      image, 
      designX, 
      designY,
      imgWidth,
      imgHeight
    );
    
    ctx.restore();
  }

  // Dibujar cámara (guía visual - zona sombreada)
  // Variables necesarias para referencia futura:
  // const camX = device.camera.x * scale + margin;
  // const camY = device.camera.y * scale + margin;
  // const camW = device.camera.w * scale;
  // const camH = device.camera.h * scale;
  // const camR = device.camera.r * scale;
  
  // Dibujar marca de agua con información
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Borde exterior para indicar el área de corte
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Línea de corte recomendada (a 3mm del borde)
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.15)';
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(margin, margin, device.width * scale, device.height * scale);
  ctx.setLineDash([]);

  return canvas;
};

export const downloadCanvas = (canvas: HTMLCanvasElement, deviceId: string, suffix: string = ''): void => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.download = `SUBLIMETAL-${deviceId}-${suffix}-${timestamp}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
};

// Exporta ambos archivos: impresión + preview
export const exportDesign = (options: ExportOptions): void => {
  // 1. Imagen para impresión
  const printCanvas = generatePrintCanvas(options);
  downloadCanvas(printCanvas, options.device.id, 'PRINT');
  
  // 2. Imagen con preview ( boceto del modelo)
  // Pequeña demora para asegurar que el primer download inicie
  setTimeout(() => {
    const previewCanvas = generatePreviewCanvas(options);
    downloadCanvas(previewCanvas, options.device.id, 'PREVIEW');
  }, 100);
};

// Exportar solo imagen de impresión (para uso interno si se necesita)
export const exportPrintOnly = (options: ExportOptions): void => {
  const printCanvas = generatePrintCanvas(options);
  downloadCanvas(printCanvas, options.device.id, 'PRINT');
};

// Exportar solo imagen de preview (para uso interno si se necesita)
export const exportPreviewOnly = (options: ExportOptions): void => {
  const previewCanvas = generatePreviewCanvas(options);
  downloadCanvas(previewCanvas, options.device.id, 'PREVIEW');
};
