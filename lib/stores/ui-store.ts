import { create } from 'zustand';

interface UIState {
  isLibraryOpen: boolean;
  isInspectorOpen: boolean;
  isExportOpen: boolean;
  isShortcutsOpen: boolean;
  isAlbumsListOpen: boolean;
  openLibrary: () => void;
  closeLibrary: () => void;
  toggleLibrary: () => void;
  openInspector: () => void;
  closeInspector: () => void;
  toggleInspector: () => void;
  openExport: () => void;
  closeExport: () => void;
  toggleExport: () => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;
  openAlbumsList: () => void;
  closeAlbumsList: () => void;
  toggleAlbumsList: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLibraryOpen: false,
  isInspectorOpen: false,
  isExportOpen: false,
  isShortcutsOpen: false,
  isAlbumsListOpen: false,
  openLibrary: () => set({ isLibraryOpen: true }),
  closeLibrary: () => set({ isLibraryOpen: false }),
  toggleLibrary: () => set((state) => ({ isLibraryOpen: !state.isLibraryOpen })),
  openInspector: () => set({ isInspectorOpen: true }),
  closeInspector: () => set({ isInspectorOpen: false }),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
  openExport: () => set({ isExportOpen: true }),
  closeExport: () => set({ isExportOpen: false }),
  toggleExport: () => set((state) => ({ isExportOpen: !state.isExportOpen })),
  openShortcuts: () => set({ isShortcutsOpen: true }),
  closeShortcuts: () => set({ isShortcutsOpen: false }),
  toggleShortcuts: () => set((state) => ({ isShortcutsOpen: !state.isShortcutsOpen })),
  openAlbumsList: () => set({ isAlbumsListOpen: true }),
  closeAlbumsList: () => set({ isAlbumsListOpen: false }),
  toggleAlbumsList: () => set((state) => ({ isAlbumsListOpen: !state.isAlbumsListOpen })),
}));
