import { useState } from 'react';
import { toast } from 'sonner';

export type ExportFormat = 'png' | 'jpeg' | 'webp';

interface ExportOptions {
  format: ExportFormat;
  quality: number;
  scale: number;
  filename: string;
}

/**
 * Convert modern CSS color functions (lab, oklch, oklab) to RGB
 * html2canvas doesn't support these color functions from Tailwind CSS 4
 */
function convertModernColorsToRgb(element: HTMLElement) {
  const allElements = element.querySelectorAll('*');
  const elementsToProcess = [element, ...Array.from(allElements)] as HTMLElement[];

  elementsToProcess.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    const computedStyle = window.getComputedStyle(el);
    const colorProperties = [
      'color',
      'background-color',
      'border-color',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'outline-color',
    ];

    colorProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      // Check if it uses modern color functions
      if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('oklab('))) {
        // Create a temporary element to get the computed RGB value
        const temp = document.createElement('div');
        temp.style.color = value;
        document.body.appendChild(temp);
        const rgbValue = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);

        // Apply the RGB value using setProperty
        el.style.setProperty(prop, rgbValue);
      }
    });
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

    try {
      // Lazy load html2canvas (~100kb) only when needed
      const html2canvas = (await import('html2canvas')).default;
      setProgress(30);

      const canvas = await html2canvas(element, {
        scale: options.scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        // Convert modern CSS colors (lab, oklch) to RGB before rendering
        onclone: (_doc, clonedElement) => {
          convertModernColorsToRgb(clonedElement);
        },
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
