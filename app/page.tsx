"use client";

import { CanvasArea } from "@/components/CanvasArea";
import { LibrarySidebar } from "@/components/LibrarySidebar";
import { InspectorSidebar } from "@/components/InspectorSidebar";
import { AlbumsListSidebar } from "@/components/AlbumsListSidebar";
import { ExportDialog } from "@/components/ExportDialog";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useKeyboardShortcuts();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ErrorBoundary>
      <CanvasArea />
      <LibrarySidebar />
      <AlbumsListSidebar />
      <InspectorSidebar />
      <ExportDialog />
      <KeyboardShortcutsDialog />
    </ErrorBoundary>
  );
}
