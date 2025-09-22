import { ZONE } from '@/constants/api';

export const zone = {
  getZoneAnalytics(query: TZoneAnalyticsQuery) {
    return {
      path: ZONE.ANALYTICS.replace(':id', query.id),
      keys: () => [ZONE.ANALYTICS, query] as const,
      params: { period: query.period }
    };
  },
  getZone(query: Partial<TZoneQuery>) {
    return {
      path: ZONE.GET,
      keys: () => [ZONE.GET, query] as const,
      params: query
    };
  },

  getZoneById(id: string) {
    return {
      path: ZONE.GET_BY_ID.replace(':id', id),
      keys: () => [ZONE.GET, ZONE.GET_BY_ID, id] as const
    };
  },

  getAllZones(query: Partial<TZoneQuery>) {
    return {
      path: ZONE.GET,
      keys: () => [ZONE.GET, query] as const,
      params: query
    };
  }
};
