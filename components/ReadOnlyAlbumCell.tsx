import { Album, GridSettings } from '@/types';

interface ReadOnlyAlbumCellProps {
  album: Album;
  settings: GridSettings;
}

/** Static album cell for the public share view — no drag, no remove button. */
export function ReadOnlyAlbumCell({ album, settings }: ReadOnlyAlbumCellProps) {
  return (
    <div
      className="relative min-w-0 min-h-0"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
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
          className="w-full h-full object-cover select-none"
          loading="lazy"
        />

        {settings.showLabels && settings.labelPosition === 'overlay' && (
          <div
            className="absolute inset-x-0 bottom-0 p-2 text-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
          >
            <p className="text-xs font-bold truncate">{album.title}</p>
            <p className="text-xs truncate" style={{ opacity: 0.8 }}>
              {album.artist}
            </p>
          </div>
        )}
      </div>

      {settings.showLabels && settings.labelPosition === 'bottom' && (
        <div className="mt-1 text-center" style={{ color: settings.labelColor }}>
          <p className="text-xs font-bold truncate">{album.title}</p>
          <p className="text-xs truncate opacity-80">{album.artist}</p>
        </div>
      )}
    </div>
  );
}
