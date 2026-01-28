import { useState } from 'react';
import { toast } from 'sonner';

export type ExportFormat = 'png' | 'jpeg' | 'webp';

interface ExportOptions {
  format: ExportFormat;
  quality: number;
  scale: number;
  filename: string;
}

// Convert an image URL to base64 data URL via our proxy
async function imageToBase64(url: string): Promise<string> {
  try {
    // Use proxy to avoid CORS issues
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image to base64:', url, error);
    // Return original URL as fallback
    return url;
  }
}

// Convert all images in the element to base64 to avoid CORS issues
async function convertImagesToBase64(element: HTMLElement): Promise<Map<HTMLImageElement, string>> {
  const images = element.querySelectorAll('img');
  const originalSrcs = new Map<HTMLImageElement, string>();

  const conversions = Array.from(images).map(async (img) => {
    const src = img.src;
    // Skip if already a data URL or blob URL
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      return;
    }

    originalSrcs.set(img, src);
    const base64 = await imageToBase64(src);
    img.src = base64;
  });

  await Promise.all(conversions);
  return originalSrcs;
}

// Restore original image sources
function restoreImageSources(originalSrcs: Map<HTMLImageElement, string>) {
  originalSrcs.forEach((src, img) => {
    img.src = src;
  });
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportCanvas = async (elementId: string, options: ExportOptions) => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Canvas element not found');
      return;
    }

    setIsExporting(true);
    setProgress(10);

    let originalSrcs: Map<HTMLImageElement, string> | null = null;

    try {
      // Convert all images to base64 to avoid CORS issues
      toast.info('Préparation des images...');
      originalSrcs = await convertImagesToBase64(element);
      setProgress(30);

      // Lazy load html-to-image only when needed
      const htmlToImage = await import('html-to-image');
      setProgress(50);

      // Export with html-to-image using toBlob (more reliable than data URLs!)
      let blob: Blob | null = null;

      if (options.format === 'png') {
        blob = await htmlToImage.toBlob(element, {
          pixelRatio: options.scale,
          cacheBust: true,
        });
      } else if (options.format === 'jpeg') {
        blob = await htmlToImage.toBlob(element, {
          quality: options.quality,
          pixelRatio: options.scale,
          cacheBust: true,
        });
        // Convert to JPEG blob
        if (blob) {
          const img = new Image();
          const url = URL.createObjectURL(blob);
          img.src = url;
          await new Promise((resolve) => { img.onload = resolve; });
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob(resolve, 'image/jpeg', options.quality);
            });
          }
          URL.revokeObjectURL(url);
        }
      } else if (options.format === 'webp') {
        // For WebP, first get PNG blob then convert
        const pngBlob = await htmlToImage.toBlob(element, {
          pixelRatio: options.scale,
          cacheBust: true,
        });
        
        if (pngBlob) {
          const img = new Image();
          const url = URL.createObjectURL(pngBlob);
          img.src = url;
          await new Promise((resolve) => { img.onload = resolve; });
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob(resolve, 'image/webp', options.quality);
            });
          }
          URL.revokeObjectURL(url);
        }
      }

      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      setProgress(80);

      // Download the file using Blob URL (more reliable!)
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${options.filename}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL after download completes (10s for large files)
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      setProgress(100);
      toast.success('Export réussi !');
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Export échoué. Veuillez réessayer.');
    } finally {
      // Restore original image sources
      if (originalSrcs) {
        restoreImageSources(originalSrcs);
      }
      setIsExporting(false);
      setProgress(0);
    }
  };

  return { exportCanvas, isExporting, progress };
}
