import { z } from 'zod';
import type { LoggerOptions } from 'pino';

const loggerConfigSchema = z.object({
  level: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  prettyPrint: z.boolean().default(false),
});

const envConfig = loggerConfigSchema.parse({
  level: process.env.LOG_LEVEL as any,
  prettyPrint: process.env.NODE_ENV === 'development',
});

export const loggerConfig: LoggerOptions = {
  level: envConfig.level,
  ...(envConfig.prettyPrint && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
};
