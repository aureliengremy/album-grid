import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { requireUserId } from '@/lib/session';
import { shareToggleSchema } from '@/lib/validations';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = shareToggleSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, id), eq(projects.userId, userId)),
    });

    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Lazily generate a stable share slug the first time the project is shared.
    let shareSlug = project.shareSlug;
    if (result.data.isPublic && !shareSlug) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const candidate = nanoid(10);
        const existing = await db.query.projects.findFirst({
          where: eq(projects.shareSlug, candidate),
        });
        if (!existing) {
          shareSlug = candidate;
          break;
        }
      }
      if (!shareSlug) {
        return NextResponse.json(
          { error: 'Could not generate share link' },
          { status: 500 }
        );
      }
    }

    const [updated] = await db
      .update(projects)
      .set({
        isPublic: result.data.isPublic,
        shareSlug,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning({
        isPublic: projects.isPublic,
        shareSlug: projects.shareSlug,
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Project share error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
