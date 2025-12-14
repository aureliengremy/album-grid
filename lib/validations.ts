import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  source: z.enum(['spotify', 'musicbrainz']).default('spotify'),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type SearchParams = z.infer<typeof searchSchema>;
