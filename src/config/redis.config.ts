import { z } from 'zod';

const redisConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  password: z.string().optional(),
  db: z.number().default(0),
  keyPrefix: z.string().default('hiremind:'),
});

export const redisConfig = redisConfigSchema.parse({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : undefined,
  keyPrefix: process.env.REDIS_KEY_PREFIX,
});

export type RedisConfig = z.infer<typeof redisConfigSchema>;
