import { Album } from '@/types';

const BASE_URL = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'PortraitAlbumGift/1.0.0 ( contact@example.com )'; // Replace with real contact if possible

interface MusicBrainzRelease {
  id: string;
  title: string;
  date: string;
  'artist-credit': Array<{ artist: { name: string } }>;
  'cover-art-archive': { front: boolean };
}

interface MusicBrainzResponse {
  releases: MusicBrainzRelease[];
}

export async function searchMusicBrainz(query: string, limit = 20): Promise<Album[]> {
  const params = new URLSearchParams({
    query: `release:${query} AND country:FR`, // Simple query syntax
    fmt: 'json',
    limit: limit.toString(),
  });

  try {
    const res = await fetch(`${BASE_URL}/release?${params.toString()}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!res.ok) {
      throw new Error(`MusicBrainz API error: ${res.statusText}`);
    }

    const data: MusicBrainzResponse = await res.json();

    // MB doesn't always return cover art directly, often need to check Cover Art Archive.
    // We'll filter for those that claim to have front cover, but the URL construction is manual.
    // http://coverartarchive.org/release/{mbid}/front
    
    return data.releases
      .filter((r) => r['cover-art-archive']?.front) 
      .map((r) => ({
        id: r.id,
        title: r.title,
        artist: r['artist-credit']?.[0]?.artist?.name || 'Unknown Artist',
        coverUrl: `https://coverartarchive.org/release/${r.id}/front-500`, // Using 500px image
        source: 'musicbrainz',
        releaseYear: r.date?.split('-')[0],
      }));
  } catch (error) {
    console.error('MusicBrainz search failed', error);
    return [];
  }
}
