"use client";

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Album } from "@/types";
import { X } from "lucide-react";
import { useAlbumStore } from "@/lib/stores/album-store";

interface SortableAlbumProps {
  album: Album;
}

export const SortableAlbum = memo(function SortableAlbum({ album }: SortableAlbumProps) {
  const settings = useAlbumStore((state) => state.settings);
  const removeAlbum = useAlbumStore((state) => state.removeAlbum);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: album.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    // Fill the grid cell completely
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group touch-none min-w-0 min-h-0 ${isDragging ? "opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div
        className="relative overflow-hidden shadow-sm"
        style={{
          borderRadius: settings.borderRadius,
          aspectRatio: '1 / 1',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.coverUrl}
          alt={`${album.title} by ${album.artist}`}
          className="w-full h-full object-cover pointer-events-none select-none"
          loading="lazy"
          draggable={false}
        />

        {/* Labels Overlay */}
        {settings.showLabels && settings.labelPosition === 'overlay' && (
           <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2 text-white text-center">
             <p className="text-xs font-bold truncate">{album.title}</p>
             <p className="text-xs truncate opacity-80">{album.artist}</p>
           </div>
        )}

        {/* Remove Button (visible on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            removeAlbum(album.id);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-1 right-1 bg-black/60 hover:bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={`Supprimer ${album.title} de ${album.artist}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>

       {/* Labels Bottom */}
       {settings.showLabels && settings.labelPosition === 'bottom' && (
           <div className="mt-1 text-center" style={{ color: settings.labelColor }}>
             <p className="text-xs font-bold truncate">{album.title}</p>
             <p className="text-xs truncate opacity-80">{album.artist}</p>
           </div>
        )}
    </div>
  );
});
