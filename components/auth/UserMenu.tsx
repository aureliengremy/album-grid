"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUIStore } from "@/lib/stores/ui-store";
import { useProjectStore } from "@/lib/stores/project-store";
import { signOut, useSession } from "@/lib/auth-client";
import { User, FolderOpen, LogOut } from "lucide-react";
import { toast } from "sonner";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const { openAuth, openProjects } = useUIStore();
  const resetToScratch = useProjectStore((s) => s.resetToScratch);

  // Hydration guard: stable placeholder until the session resolves.
  if (isPending) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  if (!session) {
    return (
      <Button variant="outline" size="sm" onClick={openAuth}>
        <User className="w-4 h-4 mr-2" />
        Connexion
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    resetToScratch();
    toast.success("Déconnecté");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title={session.user.email}>
          <User className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="px-2 py-1.5 mb-1">
          <p className="text-sm font-medium truncate">
            {session.user.name || session.user.email}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {session.user.email}
          </p>
        </div>
        <div className="h-px bg-border my-1" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={openProjects}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Mes projets
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </PopoverContent>
    </Popover>
  );
}
