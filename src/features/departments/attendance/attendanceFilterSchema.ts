import { z } from 'zod';

export const AttendanceFilterSchema = z.object({
  Search: z.string().optional(),
  StartAt: z.string().optional(),
  EndAt: z.string().optional(),
  Period: z.coerce.number().optional(),
  AttendanceStatus: z.coerce.number().optional(),
  MeetingType: z.coerce.number().optional()
});

export type TAttendanceFilterSchema = z.infer<typeof AttendanceFilterSchema>;
