import { ReactNode } from 'react';
import { Album, GridSettings, PORTRAIT_FORMATS } from '@/types';

interface GridCanvasProps {
  albums: Album[];
  settings: GridSettings;
  /** Album cells — SortableContext in the editor, plain cells on the share page. */
  children: ReactNode;
}

/**
 * Presentational mosaic frame: portrait aspect ratio, padding, background and the
 * inner album grid. No hooks, no interactivity — usable in both server and client trees.
 */
export function GridCanvas({ albums, settings, children }: GridCanvasProps) {
  const count = albums.length || 1;
  const cols = settings.columns;
  const rows = Math.ceil(count / cols) || 1;

  const format =
    PORTRAIT_FORMATS.find((f) => f.id === settings.portraitFormatId) ||
    PORTRAIT_FORMATS.find((f) => f.id === '50x70')!;
  const aspectRatio = `${format.widthCm} / ${format.heightCm}`;

  return (
    <div
      className="shadow-sm transition-all duration-300 ease-in-out"
      style={{
        aspectRatio,
        maxWidth: '100%',
        maxHeight: '100%',
        ...(format.heightCm > format.widthCm
          ? { height: '100%', width: 'auto' }
          : { width: '100%', height: 'auto' }),
        padding: `${settings.padding}px`,
        backgroundColor: settings.backgroundColor,
      }}
      id="mosaic-canvas"
    >
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
        {children}

        {albums.length === 0 && (
          <div
            className="col-span-full h-64 flex flex-col items-center justify-center rounded-lg"
            style={{ color: '#6b7280', border: '2px dashed #d1d5db' }}
          >
            <p>No albums selected.</p>
            <p style={{ fontSize: '0.875rem' }}>
              Search and add albums from the library.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
