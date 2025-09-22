import { WALLET } from '@/constants/api';
import { TVerifyFundingTrx } from '@/routes/_authenticated/wallet/funding';

export const wallet = {
  getTransactionsLog(query: Partial<TGeneralQuery>) {
    return {
      path: WALLET.LOGS,
      keys: () => [WALLET.LOGS, query] as const,
      params: query
    };
  },

  getProcessPaystack(query: { trxRef: string; reference: string }) {
    return {
      path: WALLET.LOGS,
      keys: () => [WALLET.LOGS, query] as const,
      params: query
    };
  },

  getVerifyFunding(query: TVerifyFundingTrx) {
    return {
      path: WALLET.VERIFY,
      keys: () => [WALLET.LOGS, WALLET.VERIFY, query] as const,
      params: query
    };
  }
};
