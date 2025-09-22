import { z } from 'zod';

export const WalletSchema = z.object({
  amount: z.number().refine((val) => val > 999, { message: "You can't fund less than ₦1000" })
});

export type TWalletSchema = z.infer<typeof WalletSchema>;
