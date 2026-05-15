import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAlbumStore } from './album-store';
import type { ProjectData } from '@/lib/validations';

export interface ProjectSummary {
  id: string;
  name: string;
  isPublic: boolean;
  shareSlug: string | null;
  updatedAt: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ProjectState {
  currentProjectId: string | null;
  currentProjectName: string | null;
  isPublic: boolean;
  shareSlug: string | null;
  saveStatus: SaveStatus;
  projects: ProjectSummary[];

  setSaveStatus: (status: SaveStatus) => void;
  refreshList: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  saveCurrent: () => Promise<void>;
  createProjectFromCurrent: (name: string) => Promise<string | null>;
  renameProject: (id: string, name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setShare: (isPublic: boolean, projectId?: string) => Promise<string | null>;
  resetToScratch: () => void;
}

function currentGridData(): ProjectData {
  const { albums, settings } = useAlbumStore.getState();
  return { albums, settings };
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProjectId: null,
      currentProjectName: null,
      isPublic: false,
      shareSlug: null,
      saveStatus: 'idle',
      projects: [],

      setSaveStatus: (saveStatus) => set({ saveStatus }),

      refreshList: async () => {
        const res = await fetch('/api/projects');
        if (!res.ok) return;
        const { projects } = await res.json();
        set({ projects });
      },

      loadProject: async (id) => {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Échec du chargement du projet');
        const { project } = await res.json();

        useAlbumStore.setState({
          albums: project.data.albums,
          settings: project.data.settings,
        });
        // Avoid undoing into the previously loaded project.
        useAlbumStore.temporal.getState().clear();

        set({
          currentProjectId: project.id,
          currentProjectName: project.name,
          isPublic: project.isPublic,
          shareSlug: project.shareSlug,
          saveStatus: 'saved',
        });
      },

      saveCurrent: async () => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;

        set({ saveStatus: 'saving' });
        try {
          const res = await fetch(`/api/projects/${currentProjectId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: currentGridData() }),
          });
          if (!res.ok) throw new Error('save failed');
          set({ saveStatus: 'saved' });
        } catch (error) {
          console.error('saveCurrent error:', error);
          set({ saveStatus: 'error' });
        }
      },

      createProjectFromCurrent: async (name) => {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, data: currentGridData() }),
        });
        if (!res.ok) throw new Error('Échec de la création du projet');
        const { project } = await res.json();

        set({
          currentProjectId: project.id,
          currentProjectName: project.name,
          isPublic: project.isPublic,
          shareSlug: project.shareSlug,
          saveStatus: 'saved',
        });
        await get().refreshList();
        return project.id as string;
      },

      renameProject: async (id, name) => {
        const res = await fetch(`/api/projects/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error('Échec du renommage');
        if (get().currentProjectId === id) set({ currentProjectName: name });
        await get().refreshList();
      },

      deleteProject: async (id) => {
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Échec de la suppression');
        if (get().currentProjectId === id) get().resetToScratch();
        await get().refreshList();
      },

      setShare: async (isPublic, projectId) => {
        const targetId = projectId ?? get().currentProjectId;
        if (!targetId) return null;
        const res = await fetch(`/api/projects/${targetId}/share`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPublic }),
        });
        if (!res.ok) throw new Error('Échec du partage');
        const updated = await res.json();
        if (get().currentProjectId === targetId) {
          set({ isPublic: updated.isPublic, shareSlug: updated.shareSlug });
        }
        await get().refreshList();
        return updated.shareSlug as string | null;
      },

      resetToScratch: () => {
        useAlbumStore.temporal.getState().clear();
        set({
          currentProjectId: null,
          currentProjectName: null,
          isPublic: false,
          shareSlug: null,
          saveStatus: 'idle',
        });
      },
    }),
    {
      name: 'album-grid-project',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentProjectId: state.currentProjectId }),
    }
  )
);
