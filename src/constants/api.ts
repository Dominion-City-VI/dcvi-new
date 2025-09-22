export const AUTH = {
  LOGIN: '/auth/user-login',
  USER_REQUEST: '/auth/user-request-access',
  NEW_TOKEN: '/auth/refresh-token',
  CONFIRM_EMAIL: '/auth/confirm-email',
  FORGOT_PWD: '/auth/initiate-password-reset',
  RESET_PWD: '/auth/complete-password-reset'
} as const;

export const PROFILE = {
  USER_INFO: '/profile-mgt/get-user-info',
  UPDATE_PROFILE: '/profile-mgt/update-password',
  UPDATE_DATA: '/profile-mgt/update-bio-data'
} as const;

export const ADMIN = {
  GET_ANALYTICS: '/admin/general-analytics',
  ALL_USERS: '/admin/get-all-users',
  ACCESS_RQUESTS: '/admin/get-all-access-requests',
  ACTION_REQUESTS: '/admin/get-all-action-requests',
  GRANT_ACCESS: '/admin/grant-requestor-access',
  REQUEST_APPROVE_REJECT: '/admin/request-approve-reject',
  UPDATE_USER_ROLE: '/admin/update-role',
  MERGE_ZONE: '/admin/merge-zone',
  MERGE_CELL: '/admin/merge-cell'
};

export const ZONE = {
  CREATE: '/zone',
  ANALYTICS: '/zone/:id/dashboard-analytics',
  GET: '/zone',
  GET_BY_ID: '/zone/:id'
} as const;

export const CELL = {
  GET: '/cell',
  GET_ANALYTICS: '/cell/:id/cell-analytics',
  GET_MEMBERS: '/cell/member',
  GET_SINGLE_MEMBER: '/cell/member/:id',
  DELETE_MEMBER: '/cell/member/delete/:id',
  UPDATE_MEMBER: '/cell/member/update/:id',
  ONBOARD: '/cell/membership-onboarding',
  UPLOAD_MEMBERS: '/cell/upload-membership-onboarding',
  DELETE_CELL: '/cell/:id'
} as const;

export const ATTENDANCE = {
  MARK_ATTENDANCE: '/cell-attendance/:id',
  GET: '/cell-attendance',
  GET_V2: '/cell-attendance/get-attendance-v2',
  SERVICE_SUMMARY: '/cell-attendance/attendance-service-summary',
  STATUS_SUMMARY: '/cell-attendance/attendance-status-summary',
  PERCENTAGE_MARKED: '/cell-attendance/percentage-marked',
  ZONAL_ATTENDANCE: '/cell-attendance/:zonalId/zonal-attendance',
  ADMIN_ATTENDANCE: '/cell-attendance/admin-attendance'
};

export const SETTINGS = {
  TRAININGS: '/settings/get-trainings',
  DEPARTMENTS: '/settings/get-departments'
} as const;

export const PHONEBOOK = {
  GET_USER_PHONEBOOK: '/phone-book',
  DELETE_PHONEBOOK: '/phone-book/:id',
  GET_PHONEBOOK_CONTACTS: '/phone-book/:id',
  IMPORT: '/phone-book/import',
  ADD_CONTACT: '/phone-book/:id/add-contact',
  DELETE_CONTACT: '/phone-book/contact/:id'
};

export const SMS = {
  LOGS: '/sms/sms-logs',
  SEND: '/sms/send',
  BULK_SEND: '/sms/send-bulk',
  TERMII: '/sms/termii/call-back'
};

export const WALLET = {
  LOGS: '/transactions',
  TOP_UP: '/transactions/wallet-top-up',
  VERIFY: '/transactions/process-paystack'
};

export const USER = {
  UPDATE_PWD: '/profile-mgt/update-password',
  BIO_DATA: '/profile-mgt/update-bio-data'
};
