"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAlbumStore } from "@/lib/stores/album-store";
import { useProjectStore } from "@/lib/stores/project-store";
import { signIn, signUp } from "@/lib/auth-client";
import { authCredentialsSchema } from "@/lib/validations";
import { toast } from "sonner";

type Mode = "signin" | "signup";

/**
 * After a fresh login, if the visitor built a grid while logged out and has no
 * saved project yet, offer to import that grid into the database.
 */
function offerLocalStorageImport() {
  const hasLocalGrid = useAlbumStore.getState().albums.length > 0;
  const hasSavedProject = useProjectStore.getState().currentProjectId !== null;
  if (!hasLocalGrid || hasSavedProject) return;

  toast("Importer votre grille actuelle comme projet sauvegardé ?", {
    duration: 12000,
    action: {
      label: "Importer",
      onClick: async () => {
        try {
          await useProjectStore.getState().createProjectFromCurrent("Ma grille");
          toast.success("Grille importée");
        } catch {
          toast.error("Échec de l'import");
        }
      },
    },
  });
}

export function AuthDialog() {
  const { isAuthOpen, closeAuth } = useUIStore();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLoading(false);
  };

  const handleClose = () => {
    closeAuth();
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = authCredentialsSchema.safeParse({
      email,
      password,
      name: mode === "signup" ? name : undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Champs invalides");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        });
        if (error) {
          toast.error(error.message ?? "Échec de la création du compte");
          return;
        }
        toast.success("Compte créé");
      } else {
        const { error } = await signIn.email({ email, password });
        if (error) {
          toast.error(error.message ?? "Email ou mot de passe incorrect");
          return;
        }
        toast.success("Connecté");
      }
      handleClose();
      offerLocalStorageImport();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isAuthOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" ? "Connexion" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Connectez-vous pour sauvegarder et partager vos projets."
              : "Créez un compte pour sauvegarder vos mosaïques."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="auth-name">Nom (optionnel)</Label>
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                autoComplete="name"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-password">Mot de passe</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "..."
              : mode === "signin"
                ? "Se connecter"
                : "Créer le compte"}
          </Button>
        </form>

        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Pas de compte ? Créer un compte"
            : "Déjà un compte ? Se connecter"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
