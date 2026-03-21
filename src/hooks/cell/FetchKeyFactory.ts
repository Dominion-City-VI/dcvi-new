import { CELL } from '@/constants/api';

const LOCAL_CELL_ANALYTICS = '/analytics/cell/:id';

export const cell = {
  getCell(query: Partial<TCellQuery>) {
    return {
      path: CELL.GET,
      keys: () => [CELL.GET, query] as const,
      params: query
    };
  },

  getCellAnalytics(query: TCellAnalyticsQuery, id?: string) {
    const path = LOCAL_CELL_ANALYTICS.replace(':id', id ?? '');
    return {
      path,
      keys: () => [LOCAL_CELL_ANALYTICS.replace(':id', id ?? ''), query] as const,
      params: query,
      requestServer: 'localServer' as const
    };
  },

  getCellMember(query: Partial<TCellMemberQuery>) {
    return {
      path: CELL.GET_MEMBERS,
      keys: () => [CELL.GET, CELL.GET_MEMBERS, query] as const,
      params: query
    };
  },

  getSingleMember(id: string) {
    return {
      path: CELL.GET_SINGLE_MEMBER.replace(':id', id),
      keys: () => [CELL.GET_SINGLE_MEMBER, id] as const
    };
  }
};
