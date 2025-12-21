"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAlbumStore } from "@/lib/stores/album-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, GripVertical } from "lucide-react";
import { PORTRAIT_FORMATS } from "@/types";

export function AlbumsListSidebar() {
  const { isAlbumsListOpen, closeAlbumsList } = useUIStore();
  const { albums, settings, removeAlbum } = useAlbumStore();

  const selectedFormat = PORTRAIT_FORMATS.find(f => f.id === settings.portraitFormatId);

  // Calculate albums needed
  const albumsNeeded = selectedFormat
    ? Math.floor((selectedFormat.heightCm * settings.columns) / selectedFormat.widthCm) * settings.columns
    : 0;

  return (
    <Sheet open={isAlbumsListOpen} onOpenChange={closeAlbumsList}>
      <SheetContent side="left" className="w-[340px] flex flex-col overflow-hidden">
        <SheetHeader className="shrink-0">
          <SheetTitle>Albums sélectionnés</SheetTitle>
          <SheetDescription>
            {albums.length} / {albumsNeeded} albums
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 mt-4 min-h-0 -mx-6 px-6 py-4">
          {albums.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun album sélectionné</p>
              <p className="text-sm mt-1">Utilisez la recherche pour ajouter des albums</p>
            </div>
          ) : (
            <div className="space-y-2">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 group"
                >
                  <span className="text-xs text-muted-foreground w-5 text-center">
                    {index + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{album.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAlbum(album.id)}
                    aria-label={`Supprimer ${album.title}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
