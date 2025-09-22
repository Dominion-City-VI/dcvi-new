import { useCallback } from 'react';
import { attendance } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<Array<TAdminAttendanceItem>>) {
  return resp.data;
}

export const useFetchAdminAttendance = (
  query: Partial<TAdminZonalAttendanceQuery>
): IQueryHookResponse<Array<TAdminAttendanceItem> | undefined> => {
  const meta = attendance.getAdminAttendance(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
