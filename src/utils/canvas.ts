import { ImageConfig, DeviceTemplate } from '../types';
import { SCALE_CONFIG } from '../constants';

const BLEED_MM = 2;

interface ExportOptions {
  device: DeviceTemplate;
  image: HTMLImageElement | null;
  imageConfig: ImageConfig;
}

// ===============================
// PRINT CANVAS (300 DPI REAL)
// ===============================
export const generatePrintCanvas = ({
  device,
  image,
  imageConfig
}: ExportOptions): HTMLCanvasElement => {

  const { pxPerMm, printScale } = SCALE_CONFIG;

  const canvas = document.createElement('canvas');

  // Tamaño con sangrado
  const widthWithBleed = device.width + BLEED_MM * 2;
  const heightWithBleed = device.height + BLEED_MM * 2;

  canvas.width = Math.round(widthWithBleed * printScale);
  canvas.height = Math.round(heightWithBleed * printScale);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

  // Fondo blanco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (image) {
    // 🔥 IMPORTANTE: conversión correcta preview → print
    const ratio = printScale / pxPerMm;

    ctx.save();

    const imgWidth = image.width * imageConfig.scale;
    const imgHeight = image.height * imageConfig.scale;

    // Convertir BLEED a espacio preview
    const bleedPx = BLEED_MM * pxPerMm;

    const centerX = (imageConfig.x + bleedPx + imgWidth / 2) * ratio;
    const centerY = (imageConfig.y + bleedPx + imgHeight / 2) * ratio;

    // Rotación
    ctx.translate(centerX, centerY);
    ctx.rotate((imageConfig.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Flip
    if (imageConfig.flipH || imageConfig.flipV) {
      ctx.translate(centerX, centerY);
      ctx.scale(imageConfig.flipH ? -1 : 1, imageConfig.flipV ? -1 : 1);
      ctx.translate(-centerX, -centerY);
    }

    // Dibujar imagen
    ctx.drawImage(
      image,
      (imageConfig.x + bleedPx) * ratio,
      (imageConfig.y + bleedPx) * ratio,
      imgWidth * ratio,
      imgHeight * ratio
    );

    ctx.restore();
  }

  return canvas;
};

// ===============================
// PREVIEW CANVAS (NO TOCAR)
// ===============================
export const generatePreviewCanvas = ({
  device,
  image,
  imageConfig
}: ExportOptions): HTMLCanvasElement => {

  const { pxPerMm } = SCALE_CONFIG;
  const scale = pxPerMm;

  const canvas = document.createElement('canvas');
  const margin = 40;

  canvas.width = device.width * scale + margin * 2;
  canvas.height = device.height * scale + margin * 2;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo blanco
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

  if (image) {
    ctx.save();

    const imgWidth = image.width * imageConfig.scale;
    const imgHeight = image.height * imageConfig.scale;

    const centerX = imageConfig.x + imgWidth / 2 + margin;
    const centerY = imageConfig.y + imgHeight / 2 + margin;

    ctx.translate(centerX, centerY);
    ctx.rotate((imageConfig.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    if (imageConfig.flipH || imageConfig.flipV) {
      ctx.translate(centerX, centerY);
      ctx.scale(imageConfig.flipH ? -1 : 1, imageConfig.flipV ? -1 : 1);
      ctx.translate(-centerX, -centerY);
    }

    ctx.drawImage(
      image,
      imageConfig.x + margin,
      imageConfig.y + margin,
      imgWidth,
      imgHeight
    );

    ctx.restore();
  }

  return canvas;
};

// ===============================
// DOWNLOAD
// ===============================
export const downloadCanvas = (
  canvas: HTMLCanvasElement,
  deviceId: string,
  suffix: string = ''
): void => {

  const timestamp = new Date().toISOString().slice(0, 10);

  const link = document.createElement('a');
  link.download = `SUBLIMETAL-${deviceId}-${suffix}-${timestamp}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
};

// ===============================
// EXPORT
// ===============================
export const exportDesign = (options: ExportOptions): void => {

  const printCanvas = generatePrintCanvas(options);
  downloadCanvas(printCanvas, options.device.id, 'PRINT');

  setTimeout(() => {
    const previewCanvas = generatePreviewCanvas(options);
    downloadCanvas(previewCanvas, options.device.id, 'PREVIEW');
  }, 100);
};

export const exportPrintOnly = (options: ExportOptions): void => {
  const printCanvas = generatePrintCanvas(options);
  downloadCanvas(printCanvas, options.device.id, 'PRINT');
};

export const exportPreviewOnly = (options: ExportOptions): void => {
  const previewCanvas = generatePreviewCanvas(options);
  downloadCanvas(previewCanvas, options.device.id, 'PREVIEW');
};
