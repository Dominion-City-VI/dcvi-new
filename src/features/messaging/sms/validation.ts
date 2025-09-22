import { z } from 'zod';

export const SendSMSSchema = z.object({
  userId: z.string({ required_error: 'UserID is required.' }).trim(),
  phonebookId: z.string({ required_error: 'Select a phonebook' }).optional(),
  to: z
    .string({ required_error: 'contact is required.' })
    .min(1, { message: 'This field is required.' }),
  sms: z.string({ required_error: 'message is required.' }).trim()
});

export type TSendSMSSchema = z.infer<typeof SendSMSSchema>;
