import { EnumZoneStatus, ZONE_STATUS, ZoneStatusInfo } from '@/constants/mangle';

export function getZoneStatusByEnum(enumValue: EnumZoneStatus): ZoneStatusInfo | undefined {
  return Object.values(ZONE_STATUS).find((period) => period.enum === enumValue);
}

export function getZoneStatusText(enumValue: EnumZoneStatus): string {
  return getZoneStatusByEnum(enumValue)?.text ?? '';
}

export function allZoneStatus(): Option[] {
  return Object.values(ZONE_STATUS)
    .filter((a) => a.text !== 'All')
    .map((att_status) => ({
      label: att_status.text,
      value: att_status.enum.toString()
    }));
}
