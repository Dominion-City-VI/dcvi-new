import { EnumSMSStatus, EnumSMSType } from '@/constants/mangle';

export const smsCallTypes = new Map<EnumSMSType, string>([
  [EnumSMSType.SINGLE, 'bg-purple-100/40 text-purple-800 dark:text-purple-200 border-purple-300'],

  [EnumSMSType.BULK, 'bg-slate-100/40 text-slate-800 dark:text-slate-200 border-slate-300']
]);

export const smsStatusCallTypes = new Map<EnumSMSStatus, string>([
  [EnumSMSStatus.SENT, 'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'],

  [EnumSMSStatus.PENDING, 'bg-amber-100/40 text-amber-800 dark:text-amber-200 border-amber-300']
]);
