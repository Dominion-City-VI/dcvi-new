import { z } from 'zod';

export const OnboardMemberSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  emailAddress: z.string().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  gender: z.string().min(1, 'Gender is required'),
  zoneId: z.string(),
  cellId: z.string(),
  trainings: z.array(z.object({
    value: z.string(),
    label: z.string(),
    disable: z.boolean().optional()
  })).default([]),
  departments: z.array(z.object({
    value: z.string(),
    label: z.string(),
    disable: z.boolean().optional()
  })).default([]),
  // Use z.boolean() without .default() or .optional()
  isAssistantCellLeader: z.boolean(),
  isConsideredLeader: z.boolean(),
  isDcMember: z.boolean()
});

export type TOnboardMemberSchema = z.infer<typeof OnboardMemberSchema>;