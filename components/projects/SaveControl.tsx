"use client";

import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/stores/project-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useSession } from "@/lib/auth-client";
import { Save } from "lucide-react";
import { toast } from "sonner";

export function SaveControl() {
  const { data: session, isPending } = useSession();
  const { currentProjectId, currentProjectName, saveStatus, saveCurrent } =
    useProjectStore();
  const openProjects = useUIStore((s) => s.openProjects);

  if (isPending || !session) return null;

  const statusLabel: Record<string, string> = {
    saving: "Enregistrement…",
    saved: "Enregistré",
    error: "Échec — réessayer",
    idle: "",
  };

  if (!currentProjectId) {
    return (
      <Button variant="outline" size="sm" onClick={openProjects}>
        <Save className="w-4 h-4 mr-2" />
        Enregistrer le projet
      </Button>
    );
  }

  const handleSave = async () => {
    await saveCurrent();
    if (useProjectStore.getState().saveStatus === "error") {
      toast.error("Échec de l'enregistrement");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xs hidden md:inline ${
          saveStatus === "error"
            ? "text-destructive"
            : "text-muted-foreground"
        }`}
        title={currentProjectName ?? undefined}
      >
        {statusLabel[saveStatus]}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={saveStatus === "saving"}
      >
        <Save className="w-4 h-4 mr-2" />
        Enregistrer
      </Button>
    </div>
  );
}
