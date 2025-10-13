import {
  EnumActionRequestType,
  ACTION_REQUEST_TYPE,
  ActionRequestTypes,
  ACTION_REQUEST_STATUS,
  EnumActionRequestStatus,
  ActionRequestStatus,
  EnumCellType,
  CellType,
  CELL_TYPE,
  CellHoldingDayOfTheWeekEnum,
  CELL_HOLDING_DAY,
  CellHoldingDayOfTheWeek
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

export function getCelltypeByEnum(
  enumValue: EnumCellType
): CellType | undefined {
  return Object.values(CELL_TYPE).find((req) => req.enum === enumValue);
}

export function getCellTypeText(enumValue: EnumCellType): string {
  return getCelltypeByEnum(enumValue)?.text ?? '';
}

export function getCellHoldingByEnum(
  enumValue: CellHoldingDayOfTheWeekEnum
): CellHoldingDayOfTheWeek | undefined {
  return Object.values(CELL_HOLDING_DAY).find((req) => req.enum === enumValue);
}

export function getCellHoldingDayText(enumValue: CellHoldingDayOfTheWeekEnum): string {
  return getCellHoldingByEnum(enumValue)?.text ?? '';
}