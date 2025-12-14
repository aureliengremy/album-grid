"use client";

import { useAlbumStore } from "@/lib/stores/album-store";

export function AppFooter() {
  const count = useAlbumStore(state => state.albums.length);

  return (
    <footer className="h-10 border-t bg-background/95 backdrop-blur flex items-center justify-between px-4 text-xs text-muted-foreground z-50">
      <div>
        Portrait Album Gift &copy; {new Date().getFullYear()}
      </div>
      <div>
        {count} album{count !== 1 ? 's' : ''} selected
      </div>
    </footer>
  );
}
