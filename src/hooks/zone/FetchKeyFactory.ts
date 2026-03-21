import { ZONE } from '@/constants/api';

const LOCAL_ZONE_ANALYTICS = '/analytics/zone/:id';

export const zone = {
  getZoneAnalytics(query: TZoneAnalyticsQuery) {
    const path = LOCAL_ZONE_ANALYTICS.replace(':id', query.id);
    return {
      path,
      keys: () => [LOCAL_ZONE_ANALYTICS, query] as const,
      params: { period: query.period },
      requestServer: 'localServer' as const
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
