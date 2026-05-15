import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  source: z.enum(['spotify', 'musicbrainz']).default('spotify'),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type SearchParams = z.infer<typeof searchSchema>;

// --- Auth ---

export const authCredentialsSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum").max(128),
  name: z.string().min(1).max(80).optional(),
});

// --- Projects ---

export const albumSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  coverUrl: z.string().url(),
  source: z.enum(['spotify', 'musicbrainz']),
  releaseYear: z.string().optional(),
});

export const gridSettingsSchema = z.object({
  columns: z.number().int().min(1).max(20),
  gap: z.number().min(0),
  padding: z.number().min(0),
  backgroundColor: z.string(),
  showLabels: z.boolean(),
  labelColor: z.string(),
  labelPosition: z.enum(['bottom', 'overlay']),
  borderRadius: z.number().min(0),
  portraitFormatId: z.string(),
});

export const projectDataSchema = z.object({
  albums: z.array(albumSchema).max(200),
  settings: gridSettingsSchema,
});

export type ProjectData = z.infer<typeof projectDataSchema>;

export const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  data: projectDataSchema,
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  data: projectDataSchema.optional(),
});

export const shareToggleSchema = z.object({
  isPublic: z.boolean(),
});
