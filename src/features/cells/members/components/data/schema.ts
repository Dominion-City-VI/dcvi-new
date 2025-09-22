import { z } from 'zod';

export const memberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});
