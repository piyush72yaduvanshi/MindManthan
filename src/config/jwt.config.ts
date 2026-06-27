import { z } from 'zod';

const jwtConfigSchema = z.object({
  secret: z.string().min(32, 'JWT secret must be at least 32 characters'),
  accessTokenExpiry: z.string().default('15m'),
  refreshTokenExpiry: z.string().default('7d'),
  algorithm: z.enum(['HS256', 'HS384', 'HS512']).default('HS256'),
});

export const jwtConfig = jwtConfigSchema.parse({
  secret: process.env.JWT_SECRET,
  accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  algorithm: process.env.JWT_ALGORITHM as any,
});

export type JwtConfig = z.infer<typeof jwtConfigSchema>;
