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
import { GridCanvas } from './GridCanvas';
import { useState, useMemo } from 'react';

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <GridCanvas albums={albums} settings={settings}>
        <SortableContext
          items={albums.map((a) => a.id)}
          strategy={rectSortingStrategy}
        >
          {albums.map((album) => (
            <SortableAlbum key={album.id} album={album} />
          ))}
        </SortableContext>
      </GridCanvas>

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
