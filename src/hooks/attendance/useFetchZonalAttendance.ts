import { useCallback } from 'react';
import { attendance } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<Array<TZonalAttendanceItem>>) {
  return resp.data;
}

export const useFetchZonalttendance = (
  zonalId: string,
  query: Partial<TZoneAttendanceQuery>
): IQueryHookResponse<Array<TZonalAttendanceItem> | undefined> => {
  const meta = attendance.getZoneAttendance(zonalId, query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
