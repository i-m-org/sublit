import { useState, useCallback, useRef } from 'react';
import { ImageConfig, DeviceTemplate } from '../types';
import { 
  SCALE_CONFIG, 
  DEFAULT_IMAGE_CONFIG, 
  VALID_IMAGE_TYPES, 
  MAX_FILE_SIZE 
} from '../constants';

interface UseImageUploadProps {
  selectedTemplate: DeviceTemplate;
  onError: (message: string) => void;
}

interface UseImageUploadReturn {
  image: HTMLImageElement | null;
  imageConfig: ImageConfig;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleResetPosition: () => void;
}

export const useImageUpload = ({ 
  selectedTemplate, 
  onError 
}: UseImageUploadProps): UseImageUploadReturn => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageConfig, setImageConfig] = useState<ImageConfig>(DEFAULT_IMAGE_CONFIG);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pxPerMm } = SCALE_CONFIG;

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      onError('Formato no válido. Usa JPG, PNG, WebP o SVG');
      return;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      onError('La imagen es muy grande. Máximo 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        // Centrar imagen en la placa
        setImageConfig({
          x: (selectedTemplate.width * pxPerMm) / 2 - (img.width * 0.1) / 2,
          y: (selectedTemplate.height * pxPerMm) / 2 - (img.height * 0.1) / 2,
          scale: 0.1,
          rotation: 0,
          flipH: false,
          flipV: false,
        });
      };
      img.onerror = () => {
        onError('Error al cargar la imagen');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Limpiar input para permitir re-selección
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedTemplate, pxPerMm, onError]);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setImageConfig(DEFAULT_IMAGE_CONFIG);
  }, []);

  const handleResetPosition = useCallback(() => {
    if (!image) return;
    setImageConfig({
      x: (selectedTemplate.width * pxPerMm) / 2 - (image.width * 0.1) / 2,
      y: (selectedTemplate.height * pxPerMm) / 2 - (image.height * 0.1) / 2,
      scale: 0.1,
      rotation: 0,
      flipH: false,
      flipV: false,
    });
  }, [image, selectedTemplate, pxPerMm]);

  return {
    image,
    imageConfig,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    handleResetPosition,
  };
};

export default useImageUpload;
