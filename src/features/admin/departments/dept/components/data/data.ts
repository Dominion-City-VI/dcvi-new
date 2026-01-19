import { EnumZoneStatus } from '@/constants/mangle';
import { boolean } from 'zod';

export const zoneStatusCallTypes = new Map<EnumZoneStatus, string>([
  [EnumZoneStatus.MERGED, 'bg-amber-100/40 text-amber-800 dark:text-amber-200 border-amber-300'],
  [EnumZoneStatus.IN_ACTIVE, 'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300'],
  [EnumZoneStatus.ACTIVE, 'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300']
]);


export const deptStatusTypes = new Map<boolean, string>([
  [false, 'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300'],
  [true, 'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'],
]);
