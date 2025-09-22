type TTransactionLogItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  walletId: string;
  balanceBefore: number;
  balanceAfter: number;
  amount: number;
  narration: string;
  transactionDirection: number;
  status: number;
  reference: string;
};

type TWallet = {
  id: string;
  createdAt: string;
  updatedAt: string;
  balance: number;
  userId: string;
};

type TTransactionLogRes = {
  transactions: TPaginatedRes & {
    items: Array<TTransactionLogItem>;
  };
  wallet: TWallet;
};
