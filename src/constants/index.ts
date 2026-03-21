import { DeviceTemplate, ScaleConfig, ImageConfig } from '../types';

// ============================================
// PLANTILLAS DE DISPOSITIVOS - MEDIDAS REALES (mm)
// ============================================
// Fuentes: GSMArena, especificaciones oficiales de fabricantes

export const DEVICE_TEMPLATES: DeviceTemplate[] = [
  // --- SERIE iPhone 15 (2023) ---
  { 
    id: 'iphone-15', 
    name: 'iPhone 15', 
    brand: 'Apple',
    width: 71.6, 
    height: 147.6, 
    cornerRadius: 12,
    camera: { x: 8, y: 8, w: 30, h: 30, r: 6 }
  },
  { 
    id: 'iphone-15-pro', 
    name: 'iPhone 15 Pro', 
    brand: 'Apple',
    width: 70.9, 
    height: 146.6, 
    cornerRadius: 12,
    camera: { x: 8, y: 8, w: 32, h: 32, r: 6 }
  },
  { 
    id: 'iphone-15-pro-max', 
    name: 'iPhone 15 Pro Max', 
    brand: 'Apple',
    width: 76.7, 
    height: 159.9, 
    cornerRadius: 12,
    camera: { x: 8, y: 8, w: 38, h: 38, r: 8 }
  },
  { 
    id: 'iphone-15-plus', 
    name: 'iPhone 15 Plus', 
    brand: 'Apple',
    width: 77.6, 
    height: 160.9, 
    cornerRadius: 12,
    camera: { x: 8, y: 8, w: 30, h: 30, r: 6 }
  },

  // --- SERIE iPhone 16 (2024) ---
  { 
    id: 'iphone-16', 
    name: 'iPhone 16', 
    brand: 'Apple',
    width: 71.6, 
    height: 147.6, 
    cornerRadius: 12,
    camera: { x: 8, y: 8, w: 26, h: 26, r: 5 }
  },
  { 
    id: 'iphone-16-pro', 
    name: 'iPhone 16 Pro', 
    brand: 'Apple',
    width: 71.5, 
    height: 149.6, 
    cornerRadius: 12,
    camera: { x: 8, y: 8, w: 33, h: 33, r: 6 }
  },
  { 
    id: 'iphone-16-pro-max', 
    name: 'iPhone 16 Pro Max', 
    brand: 'Apple',
    width: 77.6, 
    height: 163.0, 
    cornerRadius: 12,
    camera: { x: 8, y: 8, w: 36, h: 36, r: 7 }
  },

  // --- SERIE Samsung Galaxy S24 (2024) ---
  { 
    id: 'samsung-s24', 
    name: 'Samsung Galaxy S24', 
    brand: 'Samsung',
    width: 70.9, 
    height: 147.0, 
    cornerRadius: 4,
    camera: { x: 8, y: 8, w: 22, h: 40, r: 4 }
  },
  { 
    id: 'samsung-s24-plus', 
    name: 'Samsung Galaxy S24+', 
    brand: 'Samsung',
    width: 75.9, 
    height: 158.5, 
    cornerRadius: 4,
    camera: { x: 10, y: 10, w: 22, h: 44, r: 4 }
  },
  { 
    id: 'samsung-s24-ultra', 
    name: 'Samsung Galaxy S24 Ultra', 
    brand: 'Samsung',
    width: 79.0, 
    height: 162.3, 
    cornerRadius: 4,
    camera: { x: 10, y: 10, w: 25, h: 50, r: 5 }
  },

  // --- SERIE Samsung Galaxy S25 (2025) ---
  { 
    id: 'samsung-s25', 
    name: 'Samsung Galaxy S25', 
    brand: 'Samsung',
    width: 70.5, 
    height: 146.9, 
    cornerRadius: 4,
    camera: { x: 8, y: 8, w: 22, h: 40, r: 4 }
  },
  { 
    id: 'samsung-s25-plus', 
    name: 'Samsung Galaxy S25+', 
    brand: 'Samsung',
    width: 75.7, 
    height: 158.2, 
    cornerRadius: 4,
    camera: { x: 10, y: 10, w: 22, h: 44, r: 4 }
  },
  { 
    id: 'samsung-s25-ultra', 
    name: 'Samsung Galaxy S25 Ultra', 
    brand: 'Samsung',
    width: 77.6, 
    height: 162.8, 
    cornerRadius: 4,
    camera: { x: 10, y: 10, w: 24, h: 48, r: 5 }
  },

  // --- SERIE Google Pixel 8 (2023) ---
  { 
    id: 'pixel-8', 
    name: 'Google Pixel 8', 
    brand: 'Google',
    width: 70.8, 
    height: 150.5, 
    cornerRadius: 14,
    camera: { x: 0, y: 15, w: 70.8, h: 25, r: 0 }
  },
  { 
    id: 'pixel-8-pro', 
    name: 'Google Pixel 8 Pro', 
    brand: 'Google',
    width: 76.5, 
    height: 162.7, 
    cornerRadius: 14,
    camera: { x: 0, y: 12, w: 76.5, h: 28, r: 0 }
  },

  // --- SERIE Google Pixel 9 (2024) ---
  { 
    id: 'pixel-9', 
    name: 'Google Pixel 9', 
    brand: 'Google',
    width: 72.0, 
    height: 152.8, 
    cornerRadius: 14,
    camera: { x: 0, y: 14, w: 72.0, h: 26, r: 0 }
  },
  { 
    id: 'pixel-9-pro', 
    name: 'Google Pixel 9 Pro', 
    brand: 'Google',
    width: 72.0, 
    height: 152.8, 
    cornerRadius: 14,
    camera: { x: 0, y: 14, w: 72.0, h: 28, r: 0 }
  },
  { 
    id: 'pixel-9-pro-xl', 
    name: 'Google Pixel 9 Pro XL', 
    brand: 'Google',
    width: 76.5, 
    height: 162.8, 
    cornerRadius: 14,
    camera: { x: 0, y: 12, w: 76.5, h: 30, r: 0 }
  },

  // --- SERIE OnePlus 12 (2024) ---
  { 
    id: 'oneplus-12', 
    name: 'OnePlus 12', 
    brand: 'OnePlus',
    width: 75.8, 
    height: 164.3, 
    cornerRadius: 6,
    camera: { x: 12, y: 12, w: 30, h: 50, r: 6 }
  },

  // --- SERIE Xiaomi 14 (2024) ---
  { 
    id: 'xiaomi-14', 
    name: 'Xiaomi 14', 
    brand: 'Xiaomi',
    width: 71.5, 
    height: 152.8, 
    cornerRadius: 6,
    camera: { x: 10, y: 10, w: 28, h: 28, r: 5 }
  },
  { 
    id: 'xiaomi-14-ultra', 
    name: 'Xiaomi 14 Ultra', 
    brand: 'Xiaomi',
    width: 75.5, 
    height: 161.4, 
    cornerRadius: 6,
    camera: { x: 12, y: 12, w: 32, h: 40, r: 6 }
  },

  // --- SERIE Huawei P70 (2024) ---
  { 
    id: 'huawei-p70', 
    name: 'Huawei P70', 
    brand: 'Huawei',
    width: 74.5, 
    height: 157.6, 
    cornerRadius: 6,
    camera: { x: 10, y: 10, w: 26, h: 38, r: 5 }
  },
  { 
    id: 'huawei-p70-pro', 
    name: 'Huawei P70 Pro', 
    brand: 'Huawei',
    width: 75.0, 
    height: 160.0, 
    cornerRadius: 6,
    camera: { x: 10, y: 10, w: 28, h: 42, r: 5 }
  },

  // --- SERIE Oppo Find X7 (2024) ---
  { 
    id: 'oppo-find-x7', 
    name: 'Oppo Find X7', 
    brand: 'Oppo',
    width: 75.4, 
    height: 162.7, 
    cornerRadius: 6,
    camera: { x: 12, y: 12, w: 28, h: 44, r: 5 }
  },
  { 
    id: 'oppo-find-x7-ultra', 
    name: 'Oppo Find X7 Ultra', 
    brand: 'Oppo',
    width: 76.5, 
    height: 164.3, 
    cornerRadius: 6,
    camera: { x: 12, y: 12, w: 30, h: 48, r: 6 }
  },

  // --- SERIE Sony Xperia (2024) ---
  { 
    id: 'sony-xperia-1-v', 
    name: 'Sony Xperia 1 V', 
    brand: 'Sony',
    width: 71.0, 
    height: 165.0, 
    cornerRadius: 2,
    camera: { x: 8, y: 8, w: 20, h: 40, r: 2 }
  },
  { 
    id: 'sony-xperia-5-v', 
    name: 'Sony Xperia 5 V', 
    brand: 'Sony',
    width: 68.0, 
    height: 154.0, 
    cornerRadius: 2,
    camera: { x: 8, y: 8, w: 18, h: 36, r: 2 }
  },

  // --- MODELOS clsICOS/OTROS ---
  { 
    id: 'iphone-se-2022', 
    name: 'iPhone SE (2022)', 
    brand: 'Apple',
    width: 67.3, 
    height: 138.4, 
    cornerRadius: 8,
    camera: { x: 30, y: 8, w: 8, h: 8, r: 4 }
  },
  { 
    id: 'samsung-a55', 
    name: 'Samsung Galaxy A55', 
    brand: 'Samsung',
    width: 77.4, 
    height: 161.1, 
    cornerRadius: 6,
    camera: { x: 10, y: 10, w: 24, h: 38, r: 4 }
  },
  { 
    id: 'samsung-s23-fe', 
    name: 'Samsung Galaxy S23 FE', 
    brand: 'Samsung',
    width: 76.5, 
    height: 158.0, 
    cornerRadius: 4,
    camera: { x: 10, y: 10, w: 24, h: 36, r: 4 }
  },
  { 
    id: 'nothing-phone-2a', 
    name: 'Nothing Phone 2a', 
    brand: 'Nothing',
    width: 76.5, 
    height: 161.7, 
    cornerRadius: 6,
    camera: { x: 10, y: 10, w: 26, h: 40, r: 6 }
  },
];

// ============================================
// CONFIGURACIÓN DE ESCALA
// ============================================

export const SCALE_CONFIG: ScaleConfig = {
  pxPerMm: 3.5,       // Factor de conversión pixels por mm para visualización
  printScale: 11.81,  // Factor para 300 DPI (1mm = 11.81px)
  minScale: 0.01,     // Escala mínima de imagen
  maxScale: 0.5,      // Escala máxima de imagen
  scaleStep: 0.001,  // Paso del slider de escala
};

export const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  x: 0,
  y: 0,
  scale: 0.1,
  rotation: 0,
};

// ============================================
// TIPOS DE ARCHIVO VÁLIDOS
// ============================================

export const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/svg+xml'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
