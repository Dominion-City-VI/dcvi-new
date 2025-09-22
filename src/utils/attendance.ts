import { EnumAttendanceStatus, ATENDANCE_STATUSES, AttendanceStatusInfo } from '@/constants/mangle';

export function getAttendanceByEnum(
  enumValue: EnumAttendanceStatus
): AttendanceStatusInfo | undefined {
  return Object.values(ATENDANCE_STATUSES).find((period) => period.enum === enumValue);
}

export function getAttendanceStatusText(enumValue: EnumAttendanceStatus): string {
  return getAttendanceByEnum(enumValue)?.text ?? '';
}

export function allAttendance(): Option[] {
  return Object.values(ATENDANCE_STATUSES)
    .filter((a) => a.text !== 'All' && a.text !== 'Unmarked')
    .map((att_status) => ({
      label: att_status.text,
      value: att_status.enum.toString()
    }));
}
