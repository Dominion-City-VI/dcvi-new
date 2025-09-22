import {
  EnumActionRequestType,
  ACTION_REQUEST_TYPE,
  ActionRequestTypes,
  ACTION_REQUEST_STATUS,
  EnumActionRequestStatus,
  ActionRequestStatus
} from '@/constants/mangle';

export function getActionReqTypeByEnum(
  enumValue: EnumActionRequestType
): ActionRequestTypes | undefined {
  return Object.values(ACTION_REQUEST_TYPE).find((req) => req.enum === enumValue);
}

export function getActionReqTypeText(enumValue: EnumActionRequestType): string {
  return getActionReqTypeByEnum(enumValue)?.text ?? '';
}

export function getActionReqStatusByEnum(
  enumValue: EnumActionRequestStatus
): ActionRequestStatus | undefined {
  return Object.values(ACTION_REQUEST_STATUS).find((req) => req.enum === enumValue);
}

export function getActionReqStatusText(enumValue: EnumActionRequestStatus): string {
  return getActionReqStatusByEnum(enumValue)?.text ?? '';
}
