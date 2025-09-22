import { ATTENDANCE } from '@/constants/api';

export const attendance = {
  getCellAttendance(query: Partial<TCellAttendanceQuery>) {
    return {
      path: ATTENDANCE.GET,
      keys: () => [ATTENDANCE.GET, query] as const,
      params: query
    };
  },

  getZoneAttendance(zonalId: string, query: Partial<TZoneAttendanceQuery>) {
    return {
      path: ATTENDANCE.ZONAL_ATTENDANCE.replace(':zonalId', zonalId),
      keys: () => [ATTENDANCE.ZONAL_ATTENDANCE, query] as const,
      params: query
    };
  },

  getServiceSummary(query: Partial<TCellAttendanceSummaryQuery>) {
    return {
      path: ATTENDANCE.SERVICE_SUMMARY,
      keys: () => [ATTENDANCE.GET, ATTENDANCE.SERVICE_SUMMARY, query] as const,
      params: query
    };
  },

  getStatusSummary(query: Partial<TCellAttendanceSummaryQuery>) {
    return {
      path: ATTENDANCE.STATUS_SUMMARY,
      keys: () => [ATTENDANCE.GET, ATTENDANCE.STATUS_SUMMARY, query] as const,
      params: query
    };
  },

  getPercentageMarked(query: Partial<TCellAttendancePercentageMarkedQuery>) {
    return {
      path: ATTENDANCE.PERCENTAGE_MARKED,
      keys: () => [ATTENDANCE.GET, ATTENDANCE.PERCENTAGE_MARKED, query] as const,
      params: query
    };
  },

  getAdminAttendance(query: Partial<TAdminZonalAttendanceQuery>) {
    return {
      path: ATTENDANCE.ADMIN_ATTENDANCE,
      keys: () => [ATTENDANCE.ADMIN_ATTENDANCE, query] as const,
      params: query
    };
  }
};
