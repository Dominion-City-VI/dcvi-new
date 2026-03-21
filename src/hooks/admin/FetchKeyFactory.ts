import { ADMIN } from '@/constants/api';

const LOCAL_ADMIN_ANALYTICS      = '/analytics/admin';
const LOCAL_DEPT_ATT_SUMMARY     = '/analytics/admin/dept-attendance';
const LOCAL_ZONES_OVERVIEW       = '/analytics/admin/zones-overview';
const LOCAL_DEPT_OVERVIEW        = '/analytics/admin/dept-overview';
const LOCAL_LEADERS              = '/analytics/admin/leaders';
const LOCAL_ADMIN_OVERVIEW       = '/analytics/admin/overview';

export const admin = {
  getAnalytics(query: TCellAnalyticsQuery) {
    return {
      path: LOCAL_ADMIN_ANALYTICS,
      keys: () => [LOCAL_ADMIN_ANALYTICS, query] as const,
      params: query,
      requestServer: 'localServer' as const
    };
  },

  getAllUsers(query: Partial<TGeneralQuery>) {
    return {
      path: ADMIN.ALL_USERS,
      keys: () => [ADMIN.GET_ANALYTICS, ADMIN.ALL_USERS, query] as const,
      params: query
    };
  },

  getAllAccessReqs(query: Partial<TGeneralQuery>) {
    return {
      path: ADMIN.ACCESS_RQUESTS,
      keys: () => [ADMIN.GET_ANALYTICS, ADMIN.ACCESS_RQUESTS, query] as const,
      params: query
    };
  },

  getAllActionReqs(query: Partial<TGeneralQuery>) {
    return {
      path: ADMIN.ACTION_REQUESTS,
      keys: () => [ADMIN.GET_ANALYTICS, ADMIN.ACTION_REQUESTS, query] as const,
      params: query
    };
  },

  getDeptAttendanceSummary(query: { period?: string; StartAt?: string; EndAt?: string }) {
    return {
      path: LOCAL_DEPT_ATT_SUMMARY,
      keys: () => [LOCAL_DEPT_ATT_SUMMARY, query] as const,
      params: query,
      requestServer: 'localServer' as const
    };
  },

  getZonesOverview(period: string) {
    return {
      path: LOCAL_ZONES_OVERVIEW,
      keys: () => [LOCAL_ZONES_OVERVIEW, period] as const,
      params: { period },
      requestServer: 'localServer' as const
    };
  },

  getDeptOverview(period: string) {
    return {
      path: LOCAL_DEPT_OVERVIEW,
      keys: () => [LOCAL_DEPT_OVERVIEW, period] as const,
      params: { period },
      requestServer: 'localServer' as const
    };
  },

  getLeaders(period: string) {
    return {
      path: LOCAL_LEADERS,
      keys: () => [LOCAL_LEADERS, period] as const,
      params: { period },
      requestServer: 'localServer' as const
    };
  },

  getOverview(period: string) {
    return {
      path: LOCAL_ADMIN_OVERVIEW,
      keys: () => [LOCAL_ADMIN_OVERVIEW, period] as const,
      params: { period },
      requestServer: 'localServer' as const
    };
  }
};
