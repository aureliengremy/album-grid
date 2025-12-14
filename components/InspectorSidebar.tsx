"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAlbumStore } from "@/lib/stores/album-store";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/ui/button";
import { PORTRAIT_FORMATS } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Calculate how many albums are needed to fill a portrait format
function calculateAlbumsNeeded(widthCm: number, heightCm: number, columns: number): { rows: number; total: number } {
  // Each cell is square, width = portraitWidth / columns
  // Number of rows that fit = floor(portraitHeight / cellSize)
  const rows = Math.floor((heightCm * columns) / widthCm);
  return { rows, total: columns * rows };
}

export function InspectorSidebar() {
  const { isInspectorOpen, closeInspector } = useUIStore();
  const { albums, settings, updateSettings } = useAlbumStore();

  const selectedFormat = PORTRAIT_FORMATS.find(f => f.id === settings.portraitFormatId);

  // Calculate albums needed for current format and columns
  const albumsNeeded = selectedFormat
    ? calculateAlbumsNeeded(selectedFormat.widthCm, selectedFormat.heightCm, settings.columns)
    : { rows: 0, total: 0 };

  const formatsByCategory = {
    small: PORTRAIT_FORMATS.filter(f => f.category === 'small'),
    medium: PORTRAIT_FORMATS.filter(f => f.category === 'medium'),
    large: PORTRAIT_FORMATS.filter(f => f.category === 'large'),
    square: PORTRAIT_FORMATS.filter(f => f.category === 'square'),
  };

  return (
    <Sheet open={isInspectorOpen} onOpenChange={closeInspector}>
      <SheetContent side="right" className="w-[340px] flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Grid Settings</SheetTitle>
          <SheetDescription>
            Customize the appearance of your mosaic.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6">
          {/* Portrait Format */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-semibold">Format du portrait</Label>
              {selectedFormat && (
                <span className="text-xs text-muted-foreground">
                  {selectedFormat.widthCm}×{selectedFormat.heightCm} cm
                </span>
              )}
            </div>

            <div className="space-y-2">
              {/* Formats carrés */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Carrés</span>
                <div className="grid grid-cols-3 gap-1">
                  {formatsByCategory.square.map((format) => (
                    <Button
                      key={format.id}
                      variant={settings.portraitFormatId === format.id ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-auto py-1 px-2 text-xs flex flex-col"
                      onClick={() => updateSettings({ portraitFormatId: format.id })}
                    >
                      <span className="font-medium">{format.widthCm}×{format.heightCm}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Petits formats */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Petits</span>
                <div className="grid grid-cols-2 gap-1">
                  {formatsByCategory.small.map((format) => (
                    <Button
                      key={format.id}
                      variant={settings.portraitFormatId === format.id ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-auto py-1 px-2 text-xs flex flex-col"
                      onClick={() => updateSettings({ portraitFormatId: format.id })}
                    >
                      <span className="font-medium">{format.widthCm}×{format.heightCm}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Formats moyens */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Moyens</span>
                <div className="grid grid-cols-3 gap-1">
                  {formatsByCategory.medium.map((format) => (
                    <Button
                      key={format.id}
                      variant={settings.portraitFormatId === format.id ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-auto py-1 px-2 text-xs flex flex-col"
                      onClick={() => updateSettings({ portraitFormatId: format.id })}
                    >
                      <span className="font-medium">{format.widthCm}×{format.heightCm}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grands formats */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Grands</span>
                <div className="grid grid-cols-2 gap-1">
                  {formatsByCategory.large.map((format) => (
                    <Button
                      key={format.id}
                      variant={settings.portraitFormatId === format.id ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-auto py-1 px-2 text-xs flex flex-col"
                      onClick={() => updateSettings({ portraitFormatId: format.id })}
                    >
                      <span className="font-medium">{format.widthCm}×{format.heightCm}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Columns */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Colonnes</Label>
              <span className="text-xs text-muted-foreground">{settings.columns}</span>
            </div>
            <Slider
              value={[settings.columns]}
              onValueChange={([v]) => updateSettings({ columns: v })}
              min={1}
              max={10}
              step={1}
            />
          </div>

          {/* Albums needed indicator */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Grille</span>
              <span className="text-sm font-mono">
                {settings.columns} × {albumsNeeded.rows}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Albums nécessaires</span>
              <span className={`text-sm font-bold ${albums.length >= albumsNeeded.total ? 'text-green-600' : 'text-orange-500'}`}>
                {albums.length} / {albumsNeeded.total}
              </span>
            </div>
          </div>

          {/* Gap */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Gap (px)</Label>
              <span className="text-xs text-muted-foreground">{settings.gap}px</span>
            </div>
            <Slider
              value={[settings.gap]}
              onValueChange={([v]) => updateSettings({ gap: v })}
              min={0}
              max={100}
              step={1}
            />
          </div>

          {/* Padding */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Padding (px)</Label>
              <span className="text-xs text-muted-foreground">{settings.padding}px</span>
            </div>
            <Slider
              value={[settings.padding]}
              onValueChange={([v]) => updateSettings({ padding: v })}
              min={0}
              max={200}
              step={8}
            />
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Border Radius (px)</Label>
              <span className="text-xs text-muted-foreground">{settings.borderRadius}px</span>
            </div>
            <Slider
              value={[settings.borderRadius]}
              onValueChange={([v]) => updateSettings({ borderRadius: v })}
              min={0}
              max={100}
              step={4}
            />
          </div>

          {/* Background Color */}
          <div className="space-y-2">
             <div className="flex justify-between items-center">
              <Label>Background</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">{settings.backgroundColor}</span>
                <Input 
                  type="color" 
                  value={settings.backgroundColor}
                  onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                  className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden shrink-0"
                />
              </div>
            </div>
          </div>

          {/* Show Labels */}
          <div className="flex items-center justify-between">
            <Label htmlFor="show-labels">Show Labels</Label>
            <Switch
              id="show-labels"
              checked={settings.showLabels}
              onCheckedChange={(v) => updateSettings({ showLabels: v })}
            />
          </div>
          
           {settings.showLabels && (
            <div className="space-y-2 pl-2 border-l-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Label Color</Label>
                  <Input 
                    type="color" 
                    value={settings.labelColor}
                    onChange={(e) => updateSettings({ labelColor: e.target.value })}
                    className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Position</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={settings.labelPosition === 'bottom' ? 'secondary' : 'outline'}
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => updateSettings({ labelPosition: 'bottom' })}
                  >
                    Bottom
                  </Button>
                  <Button 
                    variant={settings.labelPosition === 'overlay' ? 'secondary' : 'outline'}
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => updateSettings({ labelPosition: 'overlay' })}
                  >
                    Overlay
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}
