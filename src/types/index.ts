// ============================================
// DEFINICIONES DE TIPOS
// ============================================

export interface CameraConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

export interface DeviceTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  cornerRadius: number;
  camera: CameraConfig;
  brand?: string;
}

export interface ImageConfig {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface ScaleConfig {
  pxPerMm: number;
  printScale: number;
  minScale: number;
  maxScale: number;
  scaleStep: number;
}

export interface Position {
  x: number;
  y: number;
}
