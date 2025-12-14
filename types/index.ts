export type AlbumSource = 'spotify' | 'musicbrainz';

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string; // High res URL
  source: AlbumSource;
  releaseYear?: string;
}

// Formats de portrait basés sur les standards IKEA/Impression
export interface PortraitFormat {
  id: string;
  name: string;
  category: 'small' | 'medium' | 'large' | 'square';
  widthCm: number;
  heightCm: number;
  widthPx: number;  // @ 300 DPI
  heightPx: number; // @ 300 DPI
}

// Presets de formats disponibles
export const PORTRAIT_FORMATS: PortraitFormat[] = [
  // Petits formats
  { id: '10x15', name: 'Photo Standard', category: 'small', widthCm: 10, heightCm: 15, widthPx: 1181, heightPx: 1772 },
  { id: '13x18', name: 'Portrait Standard', category: 'small', widthCm: 13, heightCm: 18, widthPx: 1535, heightPx: 2126 },
  // Formats moyens
  { id: '21x30', name: 'A4 / Lettre', category: 'medium', widthCm: 21, heightCm: 30, widthPx: 2480, heightPx: 3543 },
  { id: '30x40', name: 'Format Art', category: 'medium', widthCm: 30, heightCm: 40, widthPx: 3543, heightPx: 4724 },
  { id: '40x50', name: 'A3+', category: 'medium', widthCm: 40, heightCm: 50, widthPx: 4724, heightPx: 5906 },
  // Grands formats
  { id: '50x70', name: 'IKEA Standard', category: 'large', widthCm: 50, heightCm: 70, widthPx: 5906, heightPx: 8268 },
  { id: '61x91', name: 'Poster Cinéma', category: 'large', widthCm: 61, heightCm: 91, widthPx: 7205, heightPx: 10748 },
  // Formats carrés
  { id: '23x23', name: 'Petit Carré (RIBBA)', category: 'square', widthCm: 23, heightCm: 23, widthPx: 2717, heightPx: 2717 },
  { id: '32x32', name: 'Carré Vinyle', category: 'square', widthCm: 32, heightCm: 32, widthPx: 3780, heightPx: 3780 },
  { id: '50x50', name: 'Grand Carré', category: 'square', widthCm: 50, heightCm: 50, widthPx: 5906, heightPx: 5906 },
];

export interface GridSettings {
  columns: number;
  gap: number; // px
  padding: number; // px
  backgroundColor: string; // hex
  showLabels: boolean;
  labelColor: string; // hex
  labelPosition: 'bottom' | 'overlay';
  borderRadius: number; // px
  portraitFormatId: string; // ID du format de portrait sélectionné
}

export interface CanvasFormat {
  name: string;
  width: number;
  height: number;
  label: string;
}

export type ExportFormat = 'png' | 'jpeg' | 'webp';
