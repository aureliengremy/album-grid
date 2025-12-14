import { NextRequest, NextResponse } from 'next/server';
import { searchSchema } from '@/lib/validations';
import { searchSpotify } from '@/lib/api/spotify';
import { searchMusicBrainz } from '@/lib/api/musicbrainz';

// Simple in-memory rate limit (not production ready for serverless scaling, but fits requirements)
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const result = searchSchema.safeParse({
    q: searchParams.get('q'),
    source: searchParams.get('source'),
    limit: searchParams.get('limit'),
  });

  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { q, source, limit } = result.data;

  try {
    const albums = source === 'spotify' 
      ? await searchSpotify(q, limit)
      : await searchMusicBrainz(q, limit);

    return NextResponse.json({ results: albums });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
