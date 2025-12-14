import { Album } from '@/types';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Simple in-memory cache for token (works in lambda as long as container lives, but better to use robust storage or fetch fresh)
let token: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (token && Date.now() < tokenExpiresAt) return token;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.warn('Missing Spotify credentials, using mock mode.');
    return null;
  }

  try {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    token = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // Buffer 1 min
    return token;
  } catch (error) {
    console.error('Failed to get Spotify token', error);
    return null;
  }
}

export async function searchSpotify(query: string, limit = 20): Promise<Album[]> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return mockSearch(query, limit);
  }

  try {
    const params = new URLSearchParams({
      q: query,
      type: 'album',
      limit: limit.toString(),
    });

    const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error(`Spotify API error: ${res.statusText}`);

    const data = await res.json();
    return data.albums.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists[0]?.name || 'Unknown',
      coverUrl: item.images[0]?.url || '', // Highest res usually first
      source: 'spotify',
      releaseYear: item.release_date?.split('-')[0],
    }));
  } catch (error) {
    console.error('Spotify search failed', error);
    return [];
  }
}

function mockSearch(query: string, limit: number): Album[] {
  // Return some dummy data for development without keys
  return Array.from({ length: limit }).map((_, i) => ({
    id: `mock-${i}`,
    title: `Mock Album ${i + 1} (${query})`,
    artist: `Mock Artist`,
    coverUrl: `https://picsum.photos/500/500?random=${i}`,
    source: 'spotify',
    releaseYear: '2024',
  }));
}
