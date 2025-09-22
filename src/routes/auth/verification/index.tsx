import VerifyEmail from '@/features/auth/VerifyEmail';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const verifyEmailSearchSchema = z.object({
  userId: z.string().optional(),
  token: z.string().optional()
});

export type TVerifyEmailSearchSchema = z.infer<typeof verifyEmailSearchSchema>;

export const Route = createFileRoute('/auth/verification/')({
  component: VerifyEmail,
  validateSearch: (search) => verifyEmailSearchSchema.parse(search)
});
