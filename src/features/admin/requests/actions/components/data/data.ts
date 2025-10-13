import { EnumActionRequestStatus, EnumActionRequestType, EnumCellType } from '@/constants/mangle';

export const actionRequestTypes = new Map<EnumActionRequestType, string>([
  [
    EnumActionRequestType.CELL_MERGE,
    'bg-indigo-100/30 text-indigo-700 dark:text-indigo-300 border-indigo-200'
  ],

  [
    EnumActionRequestType.DELETE_CELL,
    'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300'
  ],

  [
    EnumActionRequestType.DELETE_ZONE,
    'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300'
  ],

  [
    EnumActionRequestType.MEMBER_DELETE,
    'bg-purple-100/40 text-purple-800 dark:text-purple-200 border-purple-300'
  ],

  [
    EnumActionRequestType.ZONAL_MERGE,
    'bg-blue-100/40 text-blue-800 dark:text-blue-200 border-blue-300'
  ]
]);

export const actionRequestStatus = new Map<EnumActionRequestStatus, string>([
  [
    EnumActionRequestStatus.APPROVED,
    'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'
  ],

  [
    EnumActionRequestStatus.PENDING,
    'bg-orange-100/40 text-orange-800 dark:text-orange-200 border-orange-300'
  ],

  [EnumActionRequestStatus.REJECTED, 'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300']
]);

export const cellTypeFormat = new Map<EnumCellType, string>([
  [
    EnumCellType.PROFESSIONAL,
    'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'
  ],

  [
    EnumCellType.CONVENTIONAL,
    'bg-orange-100/40 text-orange-800 dark:text-orange-200 border-orange-300'
  ]
]);
