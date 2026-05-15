"use client";

import { CanvasArea } from "@/components/CanvasArea";
import { LibrarySidebar } from "@/components/LibrarySidebar";
import { InspectorSidebar } from "@/components/InspectorSidebar";
import { AlbumsListSidebar } from "@/components/AlbumsListSidebar";
import { ExportDialog } from "@/components/ExportDialog";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AutosaveController } from "@/components/projects/AutosaveController";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSyncExternalStore } from "react";

// Stable "are we on the client?" signal — avoids hydration mismatches caused by
// the Zustand stores reading from localStorage. useSyncExternalStore returns the
// server snapshot (false) during SSR and the client snapshot (true) after
// hydration, without the cascading-setState pattern React 19 flags.
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Home() {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot
  );
  useKeyboardShortcuts();

  if (!mounted) return null;

  return (
    <ErrorBoundary>
      <AutosaveController />
      <CanvasArea />
      <LibrarySidebar />
      <AlbumsListSidebar />
      <InspectorSidebar />
      <ExportDialog />
      <KeyboardShortcutsDialog />
    </ErrorBoundary>
  );
}
