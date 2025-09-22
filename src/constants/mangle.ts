export enum Mangle {
  CURRENT_REG_FORM = 'crf',
  ACCESS_TOKEN = '_at',
  REFRESH_TOKEN = '_rt',
  USER = '_u',
  USER_ROLE = '_r',
  USER_ACTIVE_ROLE = '_uar',
  USER_EXTRA_INFO = '_ei'
}

export enum REQUEST_FORM {
  PERSONAL = 'PERSONAL',
  OTHERS = 'OTHERS'
}

export enum EnumRoles {
  SUPER_ADMIN = 0,
  SENIOR_PASTOR = 1,
  PASTOR = 2,
  DISTRICT_PASTOR = 3,
  ZONAL_PASTOR = 4,
  CELL_LEADER = 5,
  ASST_CELL_LEADER = 6,
  MEMBER = 7,
  DEPARTMENTAL_HEAD = 8,
  ASST_DEPARTMENTAL_HEAD = 9,
  SUB_ADMIN = 10
}

export enum EnumPeriod {
  WEEK = 1,
  MONTH = 2,
  YEAR = 3,
  QUARTERLY = 4,
  THREE_MONTHS = 5,
  THIS_MONTH = 6
}

export interface PeriodInfo {
  enum: EnumPeriod;
  name: string;
  text: string;
}

export const PERIODS: Record<string, PeriodInfo> = {
  WEEK: {
    enum: EnumPeriod.WEEK,
    name: 'WEEK',
    text: 'weekly'
  },
  MONTH: {
    enum: EnumPeriod.MONTH,
    name: 'MONTH',
    text: 'monthly'
  },
  YEAR: {
    enum: EnumPeriod.YEAR,
    name: 'YEAR',
    text: 'yearly'
  },
  QUARTERLY: {
    enum: EnumPeriod.QUARTERLY,
    name: 'QUARTERLY',
    text: 'quarteryly'
  },
  THREE_MONTH: {
    enum: EnumPeriod.QUARTERLY,
    name: 'THREE_MONTH',
    text: 'three months'
  },
  THIS_MONTH: {
    enum: EnumPeriod.QUARTERLY,
    name: 'THIS_MONTH',
    text: 'this month'
  }
};

export const PeriodNameMap = new Map<string, EnumPeriod>(
  Object.entries(PERIODS).map(([key, info]) => [key, info.enum])
);

export const periodText = new Map<string, string>(
  Object.entries(PERIODS).map(([key, info]) => [key, info.text])
);

export enum EnumAttendanceStatus {
  ALL = 0,
  PRESENT = 1,
  ABSENT = 2,
  NONCHURCHMEMBER = 3,
  TRAVELED = 4,
  SICK = 5,
  UNMARKED = 6
}

export type AttendanceStatusInfo = IEnumStatus<EnumAttendanceStatus>;

export const ATENDANCE_STATUSES: Record<string, AttendanceStatusInfo> = {
  ALL: {
    enum: EnumAttendanceStatus.ALL,
    name: 'ALL',
    text: 'All'
  },
  ABSENT: {
    enum: EnumAttendanceStatus.ABSENT,
    name: 'ABSENT',
    text: 'Absent'
  },
  NONCHURCHMEMBER: {
    enum: EnumAttendanceStatus.NONCHURCHMEMBER,
    name: 'NONCHURCHMEMBER',
    text: 'Non-church Member'
  },
  PRESENT: {
    enum: EnumAttendanceStatus.PRESENT,
    name: 'PRESENT',
    text: 'Present'
  },
  SICK: {
    enum: EnumAttendanceStatus.SICK,
    name: 'SICK',
    text: 'Sick'
  },
  TRAVELED: {
    enum: EnumAttendanceStatus.TRAVELED,
    name: 'TRAVELED',
    text: 'Traveled'
  },
  UNMARKED: {
    enum: EnumAttendanceStatus.UNMARKED,
    name: 'UNMARKED',
    text: 'Unmarked'
  }
};

export const AttendanceNameMap = new Map<string, EnumAttendanceStatus>(
  Object.entries(ATENDANCE_STATUSES).map(([key, info]) => [key, info.enum])
);

export const attendanceText = new Map<string, string>(
  Object.entries(ATENDANCE_STATUSES).map(([key, info]) => [key, info.text])
);

export enum EnumSMSType {
  SINGLE = 0,
  BULK = 1
}

export type SMSTypeInfo = IEnumStatus<EnumSMSType>;

export const SMS_TYPE: Record<string, SMSTypeInfo> = {
  SINGLE: {
    enum: EnumSMSType.SINGLE,
    name: 'SINGLE',
    text: 'single'
  },
  BULK: {
    enum: EnumSMSType.BULK,
    name: 'BULK',
    text: 'bulk'
  }
};

export const SMSTypeNameMap = new Map<string, EnumSMSType>(
  Object.entries(SMS_TYPE).map(([key, info]) => [key, info.enum])
);

export const smsTypeText = new Map<string, string>(
  Object.entries(SMS_TYPE).map(([key, info]) => [key, info.text])
);

export enum EnumSMSStatus {
  PENDING = 1,
  SENT = 2
}

export type SMSStatusInfo = IEnumStatus<EnumSMSStatus>;

export const SMS_STATUS: Record<string, SMSStatusInfo> = {
  SENT: {
    enum: EnumSMSStatus.SENT,
    name: 'SENT',
    text: 'sent'
  },
  PENDING: {
    enum: EnumSMSStatus.PENDING,
    name: 'PENDING',
    text: 'pending'
  }
};

export const SMSStatusNameMap = new Map<string, EnumSMSStatus>(
  Object.entries(SMS_STATUS).map(([key, info]) => [key, info.enum])
);

export const smsStatusText = new Map<string, string>(
  Object.entries(SMS_STATUS).map(([key, info]) => [key, info.text])
);

export enum EnumTransactionDirection {
  CREDIT = 1,
  DEBIT = 2
}

export type TransactionDirectionInfo = IEnumStatus<EnumTransactionDirection>;

export const TRANSACTION_DIRECTION: Record<string, TransactionDirectionInfo> = {
  CREDIT: {
    enum: EnumTransactionDirection.CREDIT,
    name: 'CREDIT',
    text: 'credit'
  },
  DEBIT: {
    enum: EnumTransactionDirection.DEBIT,
    name: 'DEBIT',
    text: 'debit'
  }
};

export const TransDirNameMap = new Map<string, EnumTransactionDirection>(
  Object.entries(TRANSACTION_DIRECTION).map(([key, info]) => [key, info.enum])
);

export const transDirText = new Map<string, string>(
  Object.entries(TRANSACTION_DIRECTION).map(([key, info]) => [key, info.text])
);

export enum EnumTransactionStatus {
  PENDING = 0,
  SUCCESSFUL = 1,
  FAILED = 2
}

export type TransactionStatusInfo = IEnumStatus<EnumTransactionStatus>;

export const TRANSACTION_STATUS: Record<string, TransactionStatusInfo> = {
  PENDING: {
    enum: EnumTransactionStatus.PENDING,
    name: 'PENDING',
    text: 'pending'
  },
  SUCCESSFUL: {
    enum: EnumTransactionStatus.SUCCESSFUL,
    name: 'SUCCESSFUL',
    text: 'successful'
  },
  FAILED: {
    enum: EnumTransactionStatus.FAILED,
    name: 'FAILED',
    text: 'failed'
  }
};

export const TransStatusNameMap = new Map<string, EnumTransactionStatus>(
  Object.entries(TRANSACTION_STATUS).map(([key, info]) => [key, info.enum])
);

export const transStatusText = new Map<string, string>(
  Object.entries(TRANSACTION_STATUS).map(([key, info]) => [key, info.text])
);

// Zone status
export enum EnumZoneStatus {
  ACTIVE = 1,
  IN_ACTIVE = 2,
  MERGED = 3
}

export type ZoneStatusInfo = IEnumStatus<EnumZoneStatus>;

export const ZONE_STATUS: Record<string, ZoneStatusInfo> = {
  ACTIVE: {
    enum: EnumZoneStatus.ACTIVE,
    name: 'ACTIVE',
    text: 'active'
  },
  IN_ACTIVE: {
    enum: EnumZoneStatus.IN_ACTIVE,
    name: 'IN_ACTIVE',
    text: 'in active'
  },
  MERGED: {
    enum: EnumZoneStatus.MERGED,
    name: 'MERGED',
    text: 'merged'
  }
};

export const ZoneStatusNameMap = new Map<string, EnumZoneStatus>(
  Object.entries(ZONE_STATUS).map(([key, info]) => [key, info.enum])
);

export const zoneStatusText = new Map<string, string>(
  Object.entries(ZONE_STATUS).map(([key, info]) => [key, info.text])
);

export enum EnumAccessRequest {
  PENDING = 1,
  APPROVE = 2,
  REJECT = 3
}

export enum EnumUserAccessRequest {
  APPROVE = 2,
  CANCEL = 3
}

export enum EnumActionRequestType {
  CELL_MERGE = 1,
  ZONAL_MERGE = 2,
  MEMBER_DELETE = 3,
  DELETE_CELL = 4,
  DELETE_ZONE = 5
}

export enum EnumActionRequestStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3
}

export type ActionRequestTypes = IEnumStatus<EnumActionRequestType>;

export const ACTION_REQUEST_TYPE: Record<string, ActionRequestTypes> = {
  CELL_MERGE: {
    enum: EnumActionRequestType.CELL_MERGE,
    name: 'CELL_MERGE',
    text: 'cell merge'
  },
  DELETE_CELL: {
    enum: EnumActionRequestType.DELETE_CELL,
    name: 'DELETE_CELL',
    text: 'delete cell'
  },
  DELETE_ZONE: {
    enum: EnumActionRequestType.DELETE_ZONE,
    name: 'DELETE_ZONE',
    text: 'delete zone'
  },
  MEMBER_DELETE: {
    enum: EnumActionRequestType.MEMBER_DELETE,
    name: 'MEMBER_DELETE',
    text: 'Member delete'
  }
};

export const ActionReqsTypeNameMap = new Map<string, EnumActionRequestType>(
  Object.entries(ACTION_REQUEST_TYPE).map(([key, info]) => [key, info.enum])
);

export const actionReqTypeText = new Map<string, string>(
  Object.entries(ACTION_REQUEST_TYPE).map(([key, info]) => [key, info.text])
);

export type ActionRequestStatus = IEnumStatus<EnumActionRequestStatus>;

export const ACTION_REQUEST_STATUS: Record<string, ActionRequestStatus> = {
  PENDING: {
    enum: EnumActionRequestStatus.PENDING,
    name: 'PENDING',
    text: 'Pending'
  },
  APPROVED: {
    enum: EnumActionRequestStatus.APPROVED,
    name: 'APPROVED',
    text: 'Approved'
  },
  REJECTED: {
    enum: EnumActionRequestStatus.REJECTED,
    name: 'REJECTED',
    text: 'Rejected'
  }
};

// cell type
export enum EnumCellType {
  ALL = 0,
  CONVENTIONAL = 1,
  PROFESSIONAL = 2
}
