import { EnumPeriod, PeriodInfo, PERIODS } from '@/constants/mangle';

export function getPeriodByEnum(enumValue: EnumPeriod): PeriodInfo | undefined {
  return Object.values(PERIODS).find((period) => period.enum === enumValue);
}

export function getPeriodText(enumValue: EnumPeriod): string | undefined {
  return getPeriodByEnum(enumValue)?.text;
}
