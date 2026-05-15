"use client";

import { useEffect, useRef } from "react";
import { useAlbumStore } from "@/lib/stores/album-store";
import { useProjectStore } from "@/lib/stores/project-store";
import { useSession } from "@/lib/auth-client";

const DEBOUNCE_MS = 1500;

/**
 * Renders nothing. Two jobs:
 *  - on mount (logged in + a persisted currentProjectId) → load that project from the DB
 *  - on every grid change for a saved project → debounced autosave
 */
export function AutosaveController() {
  const { data: session, isPending } = useSession();
  const didLoadRef = useRef(false);
  const suppressRef = useRef(false);

  // Load the persisted current project once, from the DB (source of truth).
  useEffect(() => {
    if (isPending || !session || didLoadRef.current) return;
    didLoadRef.current = true;

    const id = useProjectStore.getState().currentProjectId;
    if (!id) return;

    suppressRef.current = true;
    useProjectStore
      .getState()
      .loadProject(id)
      .catch(() => {
        // Project gone or not owned anymore — fall back to a scratch grid.
        useProjectStore.getState().resetToScratch();
      })
      .finally(() => {
        suppressRef.current = false;
      });
  }, [session, isPending]);

  // Debounced autosave on grid changes.
  useEffect(() => {
    if (!session) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = useAlbumStore.subscribe(() => {
      if (suppressRef.current) return;
      const { currentProjectId, saveCurrent } = useProjectStore.getState();
      if (!currentProjectId) return;

      useProjectStore.getState().setSaveStatus("saving");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        saveCurrent();
      }, DEBOUNCE_MS);
    });

    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [session]);

  return null;
}
