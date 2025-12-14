import { useEffect } from 'react';
import { useAlbumStore } from '@/lib/stores/album-store';
import { useUIStore } from '@/lib/stores/ui-store';

export function useKeyboardShortcuts() {
  const { clearAll } = useAlbumStore(); // Note: undo/redo might need to be implemented or stubbed if not in store yet
  const { toggleExport, toggleShortcuts } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Export: Cmd + E
      if (isCmdOrCtrl && e.key === 'e') {
        e.preventDefault();
        toggleExport();
      }

      // Undo: Cmd + Z
      if (isCmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        // undo();
      }

      // Redo: Cmd + Shift + Z
      if (isCmdOrCtrl && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        // redo();
      }

      // Clear All: Cmd + Backspace
      if (isCmdOrCtrl && e.key === 'Backspace') {
        e.preventDefault();
        // Confirm before clear? Or just clear. User might want confirm.
        // For shortcut, maybe direct clear or trigger dialog.
        // clearAll();
      }

      // Help: ?
      if (e.key === '?') {
        e.preventDefault();
        toggleShortcuts();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleExport, toggleShortcuts, clearAll]);
}
