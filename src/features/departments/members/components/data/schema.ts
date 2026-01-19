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

export const deptMemberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  doB: z.string(),
  isAssistant: z.boolean(),
  isLeader: z.boolean(),
});
