"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useAlbumStore } from '@/lib/stores/album-store';
import { SortableAlbum } from './SortableAlbum';
import { useState, useMemo } from 'react';
import { PORTRAIT_FORMATS } from '@/types';

export function GridEditor() {
  const { albums, settings, reorderAlbums } = useAlbumStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderAlbums(active.id as string, over.id as string);
    }
    setActiveId(null);
  };

  const activeAlbum = useMemo(
    () => (activeId ? albums.find((a) => a.id === activeId) : null),
    [activeId, albums]
  );

  // Get selected portrait format and calculate layout
  const { aspectRatio, rows, cols, selectedFormat } = useMemo(() => {
    const count = albums.length || 1;
    const cols = settings.columns;
    const rows = Math.ceil(count / cols) || 1;

    // Get the selected portrait format
    const format = PORTRAIT_FORMATS.find(f => f.id === settings.portraitFormatId)
      || PORTRAIT_FORMATS.find(f => f.id === '50x70')!; // Fallback to IKEA Standard

    return {
      cols,
      rows,
      aspectRatio: `${format.widthCm} / ${format.heightCm}`,
      selectedFormat: format,
    };
  }, [albums.length, settings.columns, settings.portraitFormatId]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="shadow-sm transition-all duration-300 ease-in-out"
        style={{
          // Portrait format aspect ratio - always fully visible (contain behavior)
          aspectRatio,

          // Contain within parent: fit both dimensions, never exceed
          maxWidth: '100%',
          maxHeight: '100%',

          // For portrait formats (height > width), bind height and let width auto-calculate
          // For landscape/square, bind width and let height auto-calculate
          ...(selectedFormat.heightCm > selectedFormat.widthCm
            ? { height: '100%', width: 'auto' }
            : { width: '100%', height: 'auto' }),

          // Padding = frame around the entire grid
          padding: `${settings.padding}px`,
          backgroundColor: settings.backgroundColor,
        }}
        id="mosaic-canvas"
      >
        {/* Inner grid container for albums - square cells that fit */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${settings.gap}px`,
          }}
        >
        <SortableContext 
          items={albums.map(a => a.id)} 
          strategy={rectSortingStrategy}
        >
          {albums.map((album) => (
            <SortableAlbum key={album.id} album={album} />
          ))}
        </SortableContext>
        
        {/* Placeholder if empty */}
        {albums.length === 0 && (
           <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
             <p>No albums selected.</p>
             <p className="text-sm">Search and add albums from the library.</p>
           </div>
        )}
        </div>
      </div>

      <DragOverlay>
        {activeAlbum ? (
           <div className="opacity-80 w-32 h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeAlbum.coverUrl}
                alt={`Déplacement de ${activeAlbum.title}`}
                className="w-full h-full object-cover rounded-md shadow-xl"
                draggable={false}
              />
           </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
