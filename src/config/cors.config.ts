import { z } from 'zod';

const corsConfigSchema = z.object({
  origin: z.union([z.string(), z.array(z.string())]),
  credentials: z.boolean().default(true),
  methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
});

export const corsConfig = corsConfigSchema.parse({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: process.env.CORS_METHODS?.split(','),
});

export type CorsConfig = z.infer<typeof corsConfigSchema>;
