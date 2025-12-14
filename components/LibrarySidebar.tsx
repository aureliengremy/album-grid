"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlbumSearch } from "./AlbumSearch";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAlbumStore } from "@/lib/stores/album-store";
import { PORTRAIT_FORMATS } from "@/types";

export function LibrarySidebar() {
  const { isLibraryOpen, closeLibrary } = useUIStore();
  const { albums, settings } = useAlbumStore();

  const selectedFormat = PORTRAIT_FORMATS.find(f => f.id === settings.portraitFormatId);

  // Calculate albums needed
  const rows = selectedFormat
    ? Math.floor((selectedFormat.heightCm * settings.columns) / selectedFormat.widthCm)
    : 0;
  const albumsNeeded = settings.columns * rows;

  return (
    <Sheet open={isLibraryOpen} onOpenChange={closeLibrary}>
      <SheetContent side="left" className="w-[340px] flex flex-col overflow-hidden">
        <SheetHeader className="shrink-0">
          <SheetTitle>Recherche d&apos;albums</SheetTitle>
        </SheetHeader>

        {/* Grid info */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1 mt-4 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Grille</span>
            <span className="text-sm font-mono">
              {settings.columns} × {rows}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Albums nécessaires</span>
            <span className={`text-sm font-bold ${albums.length >= albumsNeeded ? 'text-green-600' : 'text-orange-500'}`}>
              {albums.length} / {albumsNeeded}
            </span>
          </div>
        </div>

        <div className="flex-1 mt-4 min-h-0">
          <AlbumSearch />
        </div>
      </SheetContent>
    </Sheet>
  );
}
