import { NextRequest, NextResponse } from 'next/server';
import { searchSpotify } from '@/lib/api/spotify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const albums = await searchSpotify(q);
  return NextResponse.json({ results: albums });
}
