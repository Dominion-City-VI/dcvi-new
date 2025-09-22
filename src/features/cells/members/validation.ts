import { email, firstName, lastName, optionSchema, phoneNumber } from '@/features/auth/validation';
import { z } from 'zod';

export const OnboardMemberSchema = z.object({
  firstName,
  lastName,
  phoneNumber,
  address: z.string({ required_error: 'Address is required.' }).trim(),
  emailAddress: email,
  maritalStatus: z.string({ required_error: 'Marital status is required.' }).trim(),
  gender: z.string({ required_error: 'Gender is required.' }).trim(),
  occupation: z
    .string({ required_error: 'Occupation is required' })
    .trim()
    .refine((value) => value !== '', 'Occupation is required'),
  trainings: z.array(optionSchema, { required_error: 'Training is required' }).default([]),
  departments: z.array(optionSchema, { required_error: 'Department is required' }).min(1),
  zone: z
    .string({ required_error: 'Zone is required.' })
    .trim()
    .refine((value) => value.length !== 0, 'Zone is required.'),
  cell: z.string({ required_error: 'cell is required.' }).default(''),
  isConsideredLeader: z.boolean().default(false),
  isAssistantCellLeader: z.boolean().default(false)
});

export type TOnboardMemberSchema = z.infer<typeof OnboardMemberSchema>;
