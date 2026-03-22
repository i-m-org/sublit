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
export const generatePreviewCanvas = ({ device, image, imageConfig }: ExportOptions): HTMLCanvasElement => {
  const { pxPerMm } = SCALE_CONFIG;
  
  // Usar escala de vista previa para mejor resolución
  const scale = pxPerMm;
  
  const canvas = document.createElement('canvas');
  // Añadir margen para el marco y efectos visuales
  const margin = 40;
  canvas.width = device.width * scale + margin * 2;
  canvas.height = device.height * scale + margin * 2;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

  // Fondo transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar fondo blanco de la placa (con margen)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const radius = device.cornerRadius * scale;
  const x = margin;
  const y = margin;
  const w = device.width * scale;
  const h = device.height * scale;
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  // Dibujar diseño del usuario
  if (image) {
    ctx.save();
    
    // Calcular centro de rotación
    const imgWidth = image.width * imageConfig.scale;
    const imgHeight = image.height * imageConfig.scale;
    const centerX = (imageConfig.x + imgWidth / 2) + margin;
    const centerY = (imageConfig.y + imgHeight / 2) + margin;
    
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
      imageConfig.x + margin, 
      imageConfig.y + margin,
      imgWidth,
      imgHeight
    );
    
    ctx.restore();
  }

  // Dibujar hueco de la cámara (círculo/rectángulo oscuro semitransparente)
  const camX = device.camera.x * scale + margin;
  const camY = device.camera.y * scale + margin;
  const camW = device.camera.w * scale;
  const camH = device.camera.h * scale;
  const camR = device.camera.r * scale;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.beginPath();
  if (camR > 0) {
    // Rectángulo con bordes redondeados
    ctx.moveTo(camX + camR, camY);
    ctx.lineTo(camX + camW - camR, camY);
    ctx.quadraticCurveTo(camX + camW, camY, camX + camW, camY + camR);
    ctx.lineTo(camX + camW, camY + camH - camR);
    ctx.quadraticCurveTo(camX + camW, camY + camH, camX + camW - camR, camY + camH);
    ctx.lineTo(camX + camR, camY + camH);
    ctx.quadraticCurveTo(camX, camY + camH, camX, camY + camH - camR);
    ctx.lineTo(camX, camY + camR);
    ctx.quadraticCurveTo(camX, camY, camX + camR, camY);
  } else {
    ctx.rect(camX, camY, camW, camH);
  }
  ctx.closePath();
  ctx.fill();
  
  // Borde del hueco de cámara
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Dibujar brillo metálico (gradient overlay)
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Borde exterior sutil
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();

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
