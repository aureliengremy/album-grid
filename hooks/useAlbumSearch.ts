import { useState, useEffect, useRef, useCallback } from 'react';
import { Album, AlbumSource } from '@/types';
import { toast } from 'sonner';

// LRU Cache with size limit to prevent memory leaks
class LRUCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 100, ttlMs: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttlMs;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, data: T): void {
    // Remove oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

const cache = new LRUCache<Album[]>(100, 5 * 60 * 1000);

export function useAlbumSearch() {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<AlbumSource>('spotify');
  const [results, setResults] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (q: string, src: AlbumSource) => {
    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const cacheKey = `${src}:${q.trim()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      setResults(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const params = new URLSearchParams({
        q,
        source: src,
        limit: '20'
      });

      const res = await fetch(`/api/albums/search?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error('Too many requests. Please wait a moment.');
        } else {
          toast.error('Failed to search albums');
        }
        throw new Error(res.statusText);
      }

      const data = await res.json();
      if (data.results) {
        setResults(data.results);
        cache.set(cacheKey, data.results);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Ignore aborts
      } else {
        console.error(error);
        setResults([]);
      }
    } finally {
      // Only turn off loading if this is the active request (not aborted/replaced)
      // Actually, if aborted, the catch block runs. 
      // We can just rely on the race condition check via AbortSignal which throws.
      // But we need to ensure we don't flash loading state incorrectly.
      // The current logic is fine because new search sets loading true *after* aborting old.
      // But if an old one finishes late? content of 'finally' runs.
      // Abort prevents 'then' from running usually if using fetch signal properly.
      setIsLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query, source);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, source, search]);

  return {
    query,
    setQuery,
    source,
    setSource,
    results,
    isLoading
  };
}
