import { useState } from 'react';
import { toast } from 'sonner';

export type ExportFormat = 'png' | 'jpeg' | 'webp';

interface ExportOptions {
  format: ExportFormat;
  quality: number;
  scale: number;
  filename: string;
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

    try {
      // Lazy load html-to-image only when needed
      const htmlToImage = await import('html-to-image');
      setProgress(30);

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
      
      // Clean up the blob URL after download completes (1s is safe for most browsers)
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setProgress(100);
      toast.success('Export successful');
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return { exportCanvas, isExporting, progress };
}
