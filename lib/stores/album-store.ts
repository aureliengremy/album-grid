import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import { Album, GridSettings } from '@/types';
import { arrayMove } from '@dnd-kit/sortable';

interface AlbumState {
  albums: Album[];
  settings: GridSettings;

  // Actions
  addAlbum: (album: Album) => void;
  removeAlbum: (id: string) => void;
  reorderAlbums: (activeId: string, overId: string) => void;
  updateSettings: (settings: Partial<GridSettings>) => void;
  resetSettings: () => void;
  clearAll: () => void;
}

const DEFAULT_SETTINGS: GridSettings = {
  columns: 3,
  gap: 16,
  padding: 32,
  backgroundColor: '#ffffff',
  showLabels: false,
  labelColor: '#000000',
  labelPosition: 'bottom',
  borderRadius: 0,
  portraitFormatId: '50x70', // IKEA Standard par défaut
};

export const useAlbumStore = create<AlbumState>()(
  temporal(
    persist(
      (set) => ({
        albums: [],
        settings: DEFAULT_SETTINGS,

        addAlbum: (album) =>
          set((state) => ({
            albums: [...state.albums, { ...album, id: `${album.id}-${Date.now()}` }],
          })),

        removeAlbum: (id) =>
          set((state) => ({
            albums: state.albums.filter((a) => a.id !== id),
          })),

        reorderAlbums: (activeId, overId) =>
          set((state) => {
            const oldIndex = state.albums.findIndex((a) => a.id === activeId);
            const newIndex = state.albums.findIndex((a) => a.id === overId);
            return {
              albums: arrayMove(state.albums, oldIndex, newIndex),
            };
          }),

        updateSettings: (newSettings) =>
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          })),

        resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

        clearAll: () => set({ albums: [] }),
      }),
      {
        name: 'album-grid-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ albums: state.albums, settings: state.settings }),
      }
    ),
    {
      limit: 50, // Limiter l'historique à 50 états
      partialize: (state) => {
        // Ne tracker que albums et settings dans l'historique
        const { addAlbum, removeAlbum, reorderAlbums, updateSettings, resetSettings, clearAll, ...rest } = state;
        return rest;
      },
    }
  )
);
