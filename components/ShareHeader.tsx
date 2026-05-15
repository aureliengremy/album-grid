import Link from 'next/link';
import { Grid3X3 } from 'lucide-react';

interface ShareHeaderProps {
  name: string;
}

export function ShareHeader({ name }: ShareHeaderProps) {
  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2 min-w-0">
        <Grid3X3 className="w-6 h-6 shrink-0" />
        <span className="font-bold text-lg shrink-0">AlbumGrid</span>
        <span className="text-muted-foreground mx-2 shrink-0">/</span>
        <span className="truncate text-sm text-muted-foreground">{name}</span>
      </div>
      <Link
        href="/"
        className="text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-accent transition-colors shrink-0"
      >
        Créer la mienne
      </Link>
    </header>
  );
}
