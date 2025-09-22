import {
  EnumSMSType,
  SMS_TYPE,
  SMSTypeInfo,
  EnumSMSStatus,
  SMSStatusInfo,
  SMS_STATUS
} from '@/constants/mangle';

// TYPE
export function getSMSTypeByEnum(enumValue: EnumSMSType): SMSTypeInfo | undefined {
  return Object.values(SMS_TYPE).find((period) => period.enum === enumValue);
}

export function getSMSTypeText(enumValue: EnumSMSType): string {
  return getSMSTypeByEnum(enumValue)?.text ?? '';
}

export function allSMSType(): Option[] {
  return Object.values(SMS_TYPE)
    .filter((a) => a.text !== 'All')
    .map((att_status) => ({
      label: att_status.text,
      value: att_status.enum.toString()
    }));
}

// STATUS
export function getSMStatusByEnum(enumValue: EnumSMSStatus): SMSStatusInfo | undefined {
  return Object.values(SMS_STATUS).find((period) => period.enum === enumValue);
}

export function getSMSStatusText(enumValue: EnumSMSStatus): string {
  return getSMStatusByEnum(enumValue)?.text ?? '';
}

export function allSMSStatus(): Option[] {
  return Object.values(SMS_STATUS)
    .filter((a) => a.text !== 'All')
    .map((att_status) => ({
      label: att_status.text,
      value: att_status.enum.toString()
    }));
}
