import { z } from 'zod';

const emailConfigSchema = z.object({
  smtp: z.object({
    host: z.string(),
    port: z.number(),
    secure: z.boolean().default(false),
    auth: z.object({
      user: z.string(),
      pass: z.string(),
    }).optional(),
  }),
  from: z.string().email(),
  fromName: z.string().default('Hire Mind'),
});

export const emailConfig = emailConfigSchema.parse({
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD 
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined,
  },
  from: process.env.SMTP_FROM,
  fromName: process.env.SMTP_FROM_NAME,
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;
