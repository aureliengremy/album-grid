"use client";

import { useAlbumSearch } from "@/hooks/useAlbumSearch";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useAlbumStore } from "@/lib/stores/album-store";
import { Album } from "@/types";

export function AlbumSearch() {
  const { query, setQuery, results, isLoading, source, setSource } = useAlbumSearch();
  const addAlbum = useAlbumStore((state) => state.addAlbum);

  const handleAdd = (album: Album) => {
    addAlbum(album);
  };

  return (
    <div className="flex flex-col h-full space-y-4 min-h-0">
      <div className="space-y-2 shrink-0">
        <Input
          placeholder="Rechercher des albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            variant={source === 'spotify' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSource('spotify')}
            className="flex-1 text-xs h-7"
          >
            Spotify
          </Button>
          <Button
            variant={source === 'musicbrainz' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSource('musicbrainz')}
            className="flex-1 text-xs h-7"
          >
            MusicBrainz
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 -mx-4 px-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && results.length === 0 && query && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No albums found.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pb-4">
          {results.map((album) => (
            <div key={album.id} className="group relative aspect-square bg-muted rounded-md overflow-hidden border border-border/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={album.coverUrl}
                alt={`${album.title} by ${album.artist}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white">
                <p className="text-xs font-bold line-clamp-2">{album.title}</p>
                <p className="text-xs opacity-80 line-clamp-1">{album.artist}</p>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 mt-2 rounded-full"
                  onClick={() => handleAdd(album)}
                  aria-label={`Ajouter ${album.title} de ${album.artist}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
