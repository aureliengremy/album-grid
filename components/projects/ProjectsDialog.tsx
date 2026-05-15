"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useUIStore } from "@/lib/stores/ui-store";
import { useProjectStore, type ProjectSummary } from "@/lib/stores/project-store";
import { useAlbumStore } from "@/lib/stores/album-store";
import { FolderOpen, Pencil, Trash2, Check, X, Plus, Copy } from "lucide-react";
import { toast } from "sonner";

function shareUrl(slug: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/share/${slug}`;
}

export function ProjectsDialog() {
  const { isProjectsOpen, closeProjects } = useUIStore();
  const {
    projects,
    currentProjectId,
    refreshList,
    loadProject,
    createProjectFromCurrent,
    renameProject,
    deleteProject,
    setShare,
    resetToScratch,
  } = useProjectStore();
  const clearAll = useAlbumStore((s) => s.clearAll);

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isProjectsOpen) refreshList();
  }, [isProjectsOpen, refreshList]);

  const handleSaveAsNew = async () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Donnez un nom au projet");
      return;
    }
    setBusy(true);
    try {
      await createProjectFromCurrent(name);
      setNewName("");
      toast.success(`Projet « ${name} » créé`);
    } catch {
      toast.error("Échec de la création du projet");
    } finally {
      setBusy(false);
    }
  };

  const handleOpen = async (id: string) => {
    setBusy(true);
    try {
      await loadProject(id);
      toast.success("Projet chargé");
      closeProjects();
    } catch {
      toast.error("Échec du chargement du projet");
    } finally {
      setBusy(false);
    }
  };

  const handleNewProject = () => {
    clearAll();
    resetToScratch();
    closeProjects();
    toast.success("Nouveau projet");
  };

  const handleRename = async (id: string) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      await renameProject(id, name);
      setEditingId(null);
    } catch {
      toast.error("Échec du renommage");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId);
      toast.success("Projet supprimé");
    } catch {
      toast.error("Échec de la suppression");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleShare = async (project: ProjectSummary) => {
    try {
      const slug = await setShare(!project.isPublic, project.id);
      if (!project.isPublic && slug) {
        await navigator.clipboard.writeText(shareUrl(slug)).catch(() => {});
        toast.success("Lien public copié dans le presse-papier");
      } else {
        toast.success("Partage désactivé");
      }
    } catch {
      toast.error("Échec du partage");
    }
  };

  const handleCopyLink = async (slug: string) => {
    await navigator.clipboard.writeText(shareUrl(slug));
    toast.success("Lien copié");
  };

  return (
    <>
      <Dialog
        open={isProjectsOpen}
        onOpenChange={(open) => !open && closeProjects()}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Mes projets</DialogTitle>
            <DialogDescription>
              Chargez, renommez, partagez ou supprimez vos mosaïques sauvegardées.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Nom du nouveau projet"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveAsNew()}
            />
            <Button onClick={handleSaveAsNew} disabled={busy} className="shrink-0">
              <Plus className="w-4 h-4 mr-1" />
              Enregistrer
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {projects.length} projet{projects.length > 1 ? "s" : ""}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNewProject}>
              Nouveau projet vierge
            </Button>
          </div>

          <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Aucun projet sauvegardé pour l&apos;instant.
              </p>
            )}
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border rounded-lg p-3 flex flex-col gap-2 ${
                  project.id === currentProjectId ? "border-primary" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {editingId === project.id ? (
                    <>
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(project.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="h-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleRename(project.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="font-medium truncate flex-1">
                        {project.name}
                      </span>
                      {project.isPublic && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Public
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        title="Renommer"
                        onClick={() => {
                          setEditingId(project.id);
                          setEditingName(project.name);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive"
                        title="Supprimer"
                        onClick={() => setDeleteId(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpen(project.id)}
                    disabled={busy}
                  >
                    <FolderOpen className="w-4 h-4 mr-1" />
                    Ouvrir
                  </Button>

                  <div className="flex items-center gap-2">
                    {project.isPublic && project.shareSlug && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(project.shareSlug!)}
                        title="Copier le lien"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Lien
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Public
                    </span>
                    <Switch
                      checked={project.isPublic}
                      onCheckedChange={() => handleToggleShare(project)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer ce projet ?"
        description="Cette action est définitive et ne peut pas être annulée."
        onConfirm={handleDelete}
        variant="destructive"
        confirmLabel="Supprimer"
      />
    </>
  );
}
