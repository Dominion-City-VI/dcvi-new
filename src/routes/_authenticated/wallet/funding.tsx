import FundingTrnx from '@/features/wallet/fundingTrnx';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const verifyFundingTranxSearchSchema = z.object({
  trxref: z.string(),
  reference: z.string()
});

export type TVerifyFundingTrx = z.infer<typeof verifyFundingTranxSearchSchema>;

export const Route = createFileRoute('/_authenticated/wallet/funding')({
  component: FundingTrnx,
  validateSearch: (search) => verifyFundingTranxSearchSchema.parse(search)
});
