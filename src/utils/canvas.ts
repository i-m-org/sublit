import { ImageConfig, DeviceTemplate } from '../types';
import { SCALE_CONFIG } from '../constants';

interface ExportOptions {
  device: DeviceTemplate;
  image: HTMLImageElement | null;
  imageConfig: ImageConfig;
}

export const generateCanvas = ({ device, image, imageConfig }: ExportOptions): HTMLCanvasElement => {
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

export const downloadCanvas = (canvas: HTMLCanvasElement, deviceId: string): void => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.download = `SUBLIMETAL-${deviceId}-${timestamp}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
};

export const exportDesign = (options: ExportOptions): void => {
  const canvas = generateCanvas(options);
  downloadCanvas(canvas, options.device.id);
};
