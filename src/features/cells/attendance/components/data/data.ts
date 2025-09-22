import { EnumAttendanceStatus } from '@/constants/mangle';

export const callTypes = new Map<EnumAttendanceStatus, string>([
  [EnumAttendanceStatus.ALL, 'bg-gray-100/30 text-gray-700 dark:text-gray-300 border-gray-200'],

  [
    EnumAttendanceStatus.PRESENT,
    'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'
  ],

  [EnumAttendanceStatus.ABSENT, 'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300'],

  [
    EnumAttendanceStatus.NONCHURCHMEMBER,
    'bg-purple-100/40 text-purple-800 dark:text-purple-200 border-purple-300'
  ],

  [
    EnumAttendanceStatus.TRAVELED,
    'bg-blue-100/40 text-blue-800 dark:text-blue-200 border-blue-300'
  ],

  [
    EnumAttendanceStatus.SICK,
    'bg-amber-100/40 text-amber-800 dark:text-amber-200 border-amber-300'
  ],

  [
    EnumAttendanceStatus.UNMARKED,
    'bg-slate-100/40 text-slate-600 dark:text-slate-400 border-slate-300'
  ]
]);
