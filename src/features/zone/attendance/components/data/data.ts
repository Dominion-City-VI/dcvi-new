export enum EnumProgressLevel {
  PERCENT_0 = 0,
  PERCENT_25 = 25,
  PERCENT_50 = 50,
  PERCENT_75 = 75,
  PERCENT_100 = 100
}

export const progressColors = new Map<EnumProgressLevel, string>([
  [EnumProgressLevel.PERCENT_0, 'bg-red-100/40 text-red-800 dark:text-red-200 border-red-300'],
  [
    EnumProgressLevel.PERCENT_25,
    'bg-orange-100/40 text-orange-800 dark:text-orange-200 border-orange-300'
  ],
  [
    EnumProgressLevel.PERCENT_50,
    'bg-yellow-100/40 text-yellow-800 dark:text-yellow-200 border-yellow-300'
  ],
  [EnumProgressLevel.PERCENT_75, 'bg-lime-100/40 text-lime-800 dark:text-lime-200 border-lime-300'],
  [
    EnumProgressLevel.PERCENT_100,
    'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'
  ]
]);

export function getProgressClass(progress: number): string {
  if (progress >= 100) return progressColors.get(EnumProgressLevel.PERCENT_100)!;
  if (progress >= 75) return progressColors.get(EnumProgressLevel.PERCENT_75)!;
  if (progress >= 50) return progressColors.get(EnumProgressLevel.PERCENT_50)!;
  if (progress >= 25) return progressColors.get(EnumProgressLevel.PERCENT_25)!;
  return progressColors.get(EnumProgressLevel.PERCENT_0)!;
}
