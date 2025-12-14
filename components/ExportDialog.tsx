"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// Select imports removed as we use buttons
// Wait, I didn't add 'select' via shadcn. I'll use simple buttons or inputs.
// Or I can install it. I'll use buttons/radio for now to avoid installing more if not needed, or install it.
// User spec mentions "Export d'images ... Choix du format".
// I'll stick to buttons for options.

import { Slider } from "@/components/ui/slider";
import { useUIStore } from "@/lib/stores/ui-store";
import { useExport, ExportFormat } from "@/hooks/useExport";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ExportDialog() {
  const { isExportOpen, closeExport } = useUIStore();
  const { exportCanvas, isExporting } = useExport();
  
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(0.9);
  const [filename, setFilename] = useState('my-mosaic');

  const handleExport = async () => {
    await exportCanvas('mosaic-canvas', {
      format,
      scale,
      quality,
      filename,
    });
    // Don't close immediately if we want to show success, but hook handles toast.
    // Maybe close?
    // closeExport(); // Optional
  };

  return (
    <Dialog open={isExportOpen} onOpenChange={closeExport}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Mosaic</DialogTitle>
          <DialogDescription>
            Download your creation in high resolution.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Filename</Label>
            <Input 
              value={filename} 
              onChange={(e) => setFilename(e.target.value)} 
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Format</Label>
            <div className="col-span-3 flex gap-2">
              {(['png', 'jpeg', 'webp'] as const).map((f) => (
                <Button
                  key={f}
                  variant={format === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat(f)}
                  className="uppercase text-xs"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Scale</Label>
            <div className="col-span-3 flex gap-2">
              {[1, 2, 3].map((s) => (
                <Button
                  key={s}
                  variant={scale === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setScale(s)}
                  className="text-xs"
                >
                  {s}x
                </Button>
              ))}
            </div>
          </div>
          
           {format !== 'png' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Quality</Label>
               <div className="col-span-3 flex items-center gap-2">
                  <Slider 
                    value={[quality]} 
                    onValueChange={([v]) => setQuality(v)} 
                    max={1} 
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right">{Math.round(quality * 100)}%</span>
               </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
