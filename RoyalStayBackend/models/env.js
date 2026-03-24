import {z} from 'zod';

const envSchema = z.object({
    RESEND_API_KEY: z.string().min(32).max(64),
    GOOGLE_CLIENT_ID: z.string().min(32).max(32),
    GOOGLE_CLIENT_SECRET: z.string().min(32).max(32),
});

export const env = envSchema.parse(process.env);
