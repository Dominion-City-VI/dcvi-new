import { ADMIN } from '@/constants/api';

const LOCAL_ADMIN_ANALYTICS = '/analytics/admin';

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
  }
};
