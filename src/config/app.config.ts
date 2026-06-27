import { z } from 'zod';

const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  port: z.number().default(3000),
  host: z.string().default('0.0.0.0'),
  apiVersion: z.string().default('v1'),
});

export const appConfig = appConfigSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
  host: process.env.HOST,
  apiVersion: process.env.API_VERSION,
});

export type AppConfig = z.infer<typeof appConfigSchema>;
