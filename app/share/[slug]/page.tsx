import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { GridCanvas } from "@/components/GridCanvas";
import { ReadOnlyAlbumCell } from "@/components/ReadOnlyAlbumCell";
import { ShareHeader } from "@/components/ShareHeader";
import type { ProjectData } from "@/lib/validations";

type Params = { params: Promise<{ slug: string }> };

async function getSharedProject(slug: string) {
  return db.query.projects.findFirst({
    where: and(eq(projects.shareSlug, slug), eq(projects.isPublic, true)),
    columns: { name: true, data: true },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getSharedProject(slug);
  if (!project) {
    return { title: "Mosaïque introuvable — AlbumGrid" };
  }
  return {
    title: `${project.name} — AlbumGrid`,
    description: `Mosaïque de pochettes d'albums créée avec AlbumGrid.`,
  };
}

export default async function SharePage({ params }: Params) {
  const { slug } = await params;
  const project = await getSharedProject(slug);
  if (!project) notFound();

  const data = project.data as ProjectData;

  return (
    <div className="flex flex-col min-h-screen">
      <ShareHeader name={project.name} />
      <main className="flex-1 flex items-center justify-center p-6 overflow-hidden bg-muted/30">
        <GridCanvas albums={data.albums} settings={data.settings}>
          {data.albums.map((album) => (
            <ReadOnlyAlbumCell
              key={album.id}
              album={album}
              settings={data.settings}
            />
          ))}
        </GridCanvas>
      </main>
    </div>
  );
}
