import { z } from 'zod';

const oauthConfigSchema = z.object({
  google: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    callbackUrl: z.string().url(),
  }),
  github: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    callbackUrl: z.string().url(),
  }),
});

export const oauthConfig = oauthConfigSchema.parse({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
  },
});

export type OAuthConfig = z.infer<typeof oauthConfigSchema>;
