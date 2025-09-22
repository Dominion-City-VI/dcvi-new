import { EnumTransactionStatus, EnumTransactionDirection } from '@/constants/mangle';

export const transDirTypes = new Map<EnumTransactionDirection, string>([
  [
    EnumTransactionDirection.CREDIT,
    'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'
  ],

  [EnumTransactionDirection.DEBIT, 'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300']
]);

export const transStatusCallTypes = new Map<EnumTransactionStatus, string>([
  [
    EnumTransactionStatus.PENDING,
    'bg-orange-100/40 text-orange-800 dark:text-orange-200 border-orange-300'
  ],
  [
    EnumTransactionStatus.SUCCESSFUL,
    'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'
  ],
  [EnumTransactionStatus.FAILED, 'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300']
]);
