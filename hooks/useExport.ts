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
      // Lazy load html2canvas (~100kb) only when needed
      const html2canvas = (await import('html2canvas')).default;
      setProgress(30);

      const canvas = await html2canvas(element, {
        scale: options.scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      setProgress(80);

      const dataUrl = canvas.toDataURL(`image/${options.format}`, options.quality);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${options.filename}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
