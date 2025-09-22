import { CELL } from '@/constants/api';

export const cell = {
  getCell(query: Partial<TCellQuery>) {
    return {
      path: CELL.GET,
      keys: () => [CELL.GET, query] as const,
      params: query
    };
  },

  getCellAnalytics(query: TCellAnalyticsQuery, id?: string) {
    return {
      path: CELL.GET_ANALYTICS.replace(':id', id ?? ''),
      keys: () => [CELL.GET_ANALYTICS.replace(':id', id ?? ''), query] as const,
      params: query
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
