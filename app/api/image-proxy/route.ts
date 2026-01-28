import { NextRequest, NextResponse } from 'next/server';

// Proxy external images to avoid CORS issues during export
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Validate URL to prevent SSRF attacks
  const allowedDomains = [
    'coverartarchive.org',
    'i.scdn.co', // Spotify CDN
    'mosaic.scdn.co', // Spotify mosaic
    'picsum.photos', // Mock images
  ];

  try {
    const parsedUrl = new URL(url);
    const isAllowed = allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain));

    if (!isAllowed) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AlbumGrid/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}
