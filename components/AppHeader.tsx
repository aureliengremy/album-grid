"use client";

import { Button } from "@/components/ui/button";
import { useAlbumStore } from "@/lib/stores/album-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { Download, Grid3X3, Search, Settings, Undo, Redo, Trash2, List } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function AppHeader() {
  const { albums, clearAll } = useAlbumStore();
  const { toggleLibrary, toggleInspector, toggleAlbumsList, openExport } = useUIStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Undo/Redo avec zundo temporal
  const temporalStore = useAlbumStore.temporal;
  const { pastStates, futureStates } = temporalStore.getState();
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const handleUndo = () => temporalStore.getState().undo();
  const handleRedo = () => temporalStore.getState().redo();

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 z-50 sticky top-0">
      <div className="flex items-center gap-2 font-bold text-lg">
        <Grid3X3 className="w-6 h-6" />
        <span>AlbumGrid</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          disabled={!canUndo}
          title="Annuler (Ctrl+Z)"
          aria-label="Annuler"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          disabled={!canRedo}
          title="Rétablir (Ctrl+Shift+Z)"
          aria-label="Rétablir"
        >
          <Redo className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button variant="outline" size="sm" className="hidden sm:flex" onClick={toggleLibrary}>
          <Search className="w-4 h-4 mr-2" />
          Search Albums
        </Button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={toggleLibrary}>
          <Search className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleAlbumsList} title="Liste des albums">
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleInspector} title="Paramètres">
          <Settings className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={() => setShowClearConfirm(true)} 
          disabled={albums.length === 0}
          title="Clear All"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        <Button variant="default" size="sm" onClick={openExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear all albums?"
        description="This will remove all albums from your mosaic. This action cannot be undone."
        onConfirm={clearAll}
        variant="destructive"
        confirmLabel="Clear All"
      />
    </header>
  );
}
