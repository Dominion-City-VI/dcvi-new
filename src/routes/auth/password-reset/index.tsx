import { createFileRoute } from '@tanstack/react-router';
import PwdReset from '@/features/auth/PwdReset';
import { z } from 'zod';

export const pwdResetSearchSchema = z.object({
  email: z.string().email()
});

export type TPwdResetSearchSchema = z.infer<typeof pwdResetSearchSchema>;

export const Route = createFileRoute('/auth/password-reset/')({
  component: PwdReset,
  validateSearch: (search) => pwdResetSearchSchema.parse(search)
});
