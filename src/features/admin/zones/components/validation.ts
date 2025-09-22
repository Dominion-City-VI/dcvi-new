import { z } from 'zod';

export const NewZoneSchema = z.object({
  zonalName: z.string({ required_error: 'Zone name is required' }),
  zoneStatus: z.number({ required_error: 'Status is required' })
});

export const DelZoneSchema = z.object({
  DeletionReason: z.string({ required_error: 'Reason is required' }),
  ZoneStatus: z.number()
});

export const NewCellSchema = z.object({
  zonalId: z.string({ required_error: 'Zone Id is required' }),
  cellName: z.string({ required_error: 'Cell name is required' }),
  cellType: z.string(),
  statusReason: z.string()
});

export type TNewZoneSchema = z.infer<typeof NewZoneSchema>;
export type TDelZoneSchema = z.infer<typeof DelZoneSchema>;
export type TNewCellSchema = z.infer<typeof NewCellSchema>;
