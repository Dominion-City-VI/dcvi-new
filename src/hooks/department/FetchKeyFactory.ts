import { DEPARTMENTS, PROFILE } from '@/constants/api';
import { ATTENDANCE } from '@/constants/api';

export const department = {
  // getZoneAnalytics(query: TZoneAnalyticsQuery) {
  //   return {
  //     path: ZONE.ANALYTICS.replace(':id', query.id),
  //     keys: () => [ZONE.ANALYTICS, query] as const,
  //     params: { period: query.period }
  //   };
  // },
  // getZone(query: Partial<TZoneQuery>) {
  //   return {
  //     path: ZONE.GET,
  //     keys: () => [ZONE.GET, query] as const,
  //     params: query
  //   };
  // },

  // getZoneById(id: string) {
  //   return {
  //     path: ZONE.GET_BY_ID.replace(':id', id),
  //     keys: () => [ZONE.GET, ZONE.GET_BY_ID, id] as const
  //   };
  // },

   getDeptAttendance(query: Partial<TCellAttendanceQuery>) {
      return {
        path: ATTENDANCE.FETCH_DEPARTMENT_ATTENDANCE,
        keys: () => [ATTENDANCE.GET, query] as const,
        params: query
      };
    },
  
    getAllDepts() {
      return {
        path: DEPARTMENTS.GET,
        keys: () => [DEPARTMENTS.GET] as const
      };
    },

    getAllDeptsWithMembers(id: string) {
      return {
        path: DEPARTMENTS.GET_BY_ID_AND_MEMBERS.replace(':id', id),
        keys: () => [DEPARTMENTS.GET_BY_ID_AND_MEMBERS.replace(':id', id)] as const
      };
    },

    getUser(id: string) {
      return {
        path: PROFILE.GET_USER_INFO.replace(':id', id),
        keys: () => [PROFILE.GET_USER_INFO.replace, id] as const
      };
    },

    getAllDeptsWithPeople() {
      return {
        path: DEPARTMENTS.GET_WITH_MEMBERS,
        keys: () => [DEPARTMENTS.GET_WITH_MEMBERS] as const
      };
    },
};
