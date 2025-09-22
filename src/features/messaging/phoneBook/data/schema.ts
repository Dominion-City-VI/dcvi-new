import { z } from 'zod';

export const phoneBookSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
  userId: z.string()
});

export const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  phoneBookId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type TPhoneBook = z.infer<typeof phoneBookSchema>;
