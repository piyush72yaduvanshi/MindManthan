import { z } from 'zod';

const awsConfigSchema = z.object({
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  s3: z.object({
    bucket: z.string(),
    uploadPath: z.string().default('uploads/'),
  }),
});

export const awsConfig = awsConfigSchema.parse({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    uploadPath: process.env.AWS_S3_UPLOAD_PATH,
  },
});

export type AwsConfig = z.infer<typeof awsConfigSchema>;
