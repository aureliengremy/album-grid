"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/lib/stores/ui-store";

export function KeyboardShortcutsDialog() {
  const { isShortcutsOpen, closeShortcuts } = useUIStore();

  const shortcuts = [
    { key: "Ctrl/Cmd + Z", description: "Undo" },
    { key: "Ctrl/Cmd + Shift + Z", description: "Redo" },
    { key: "Ctrl/Cmd + E", description: "Export" },
    { key: "Ctrl/Cmd + Backspace", description: "Clear All" },
    { key: "Escape", description: "Close Dialogs" },
    { key: "?", description: "Show Shortcuts" },
  ];

  return (
    <Dialog open={isShortcutsOpen} onOpenChange={closeShortcuts}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Boost your productivity with these shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex justify-between items-center bg-muted/50 p-2 rounded text-sm">
              <span>{s.description}</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
