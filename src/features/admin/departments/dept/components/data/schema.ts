import { z } from 'zod';

export const ZoneZonalLeaderSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  zonalLeaderId: z.string()
});

export const ZoneItemSchema = z.object({
  userId: z.string().nullable(),
  cellLeaderName: z.string().nullable(),
  cellLeaderEmail: z.string().email().nullable(),
  cellLeaderPhoneNumber: z.string().nullable(),
  cellName: z.string().nullable(),
  cellId: z.string()
});
