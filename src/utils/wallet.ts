import {
  EnumTransactionDirection,
  TransactionDirectionInfo,
  TRANSACTION_DIRECTION,
  EnumTransactionStatus,
  TransactionStatusInfo,
  TRANSACTION_STATUS
} from '@/constants/mangle';

export function ccyFormatter(
  p: number,
  notation: Intl.NumberFormatOptions['notation'] = 'standard'
) {
  return new Intl.NumberFormat('en-NG', {
    currencyDisplay: 'narrowSymbol',
    style: 'currency',
    currency: 'NGN',
    notation
  }).format(p);
}

// TRANSACTION DIRECTION
export function getTransDirByEnum(
  enumValue: EnumTransactionDirection
): TransactionDirectionInfo | undefined {
  return Object.values(TRANSACTION_DIRECTION).find((period) => period.enum === enumValue);
}

export function getTransDirText(enumValue: EnumTransactionDirection): string {
  return getTransDirByEnum(enumValue)?.text ?? '';
}

export function allTransDir(): Option[] {
  return Object.values(TRANSACTION_DIRECTION)
    .filter((a) => a.text !== 'All')
    .map((att_status) => ({
      label: att_status.text,
      value: att_status.enum.toString()
    }));
}

// TRANSACTION STATUS
export function getTransStatusByEnum(
  enumValue: EnumTransactionStatus
): TransactionStatusInfo | undefined {
  return Object.values(TRANSACTION_STATUS).find((period) => period.enum === enumValue);
}

export function getTransStatusText(enumValue: EnumTransactionStatus): string {
  return getTransStatusByEnum(enumValue)?.text ?? '';
}

export function allTransStatus(): Option[] {
  return Object.values(TRANSACTION_STATUS)
    .filter((a) => a.text !== 'All')
    .map((att_status) => ({
      label: att_status.text,
      value: att_status.enum.toString()
    }));
}
