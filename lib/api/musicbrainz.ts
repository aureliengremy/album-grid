import { Album } from '@/types';

const BASE_URL = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'AlbumGrid/1.0.0 (https://github.com/albumgrid)';

interface MusicBrainzRelease {
  id: string;
  title: string;
  date?: string;
  'primary-type'?: string;
  'release-group'?: { 'primary-type'?: string };
  'artist-credit': Array<{ artist: { name: string } }>;
}

interface MusicBrainzResponse {
  releases: MusicBrainzRelease[];
}

export async function searchMusicBrainz(query: string, limit = 20): Promise<Album[]> {
  // Search by artist name OR release name (album title)
  const searchQuery = `(artist:"${query}" OR release:"${query}")`;

  const params = new URLSearchParams({
    query: searchQuery,
    fmt: 'json',
    limit: (limit * 2).toString(), // Request more to account for filtering
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

    // Deduplicate by title + artist (keep first occurrence which is usually highest scored)
    const seen = new Set<string>();

    return data.releases
      .filter((r) => {
        // Only include albums (check release-group type if available)
        const type = r['release-group']?.['primary-type'];
        if (type && type !== 'Album') return false;

        // Deduplicate
        const key = `${r.title.toLowerCase()}-${r['artist-credit']?.[0]?.artist?.name?.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);

        return true;
      })
      .slice(0, limit)
      .map((r) => ({
        id: r.id,
        title: r.title,
        artist: r['artist-credit']?.[0]?.artist?.name || 'Unknown Artist',
        coverUrl: `https://coverartarchive.org/release/${r.id}/front-500`,
        source: 'musicbrainz' as const,
        releaseYear: r.date?.split('-')[0],
      }));
  } catch (error) {
    console.error('MusicBrainz search failed', error);
    return [];
  }
}
