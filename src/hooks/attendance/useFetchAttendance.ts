import { useCallback } from 'react';
import { attendance } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<Array<TCellAttendanceItem>>) {
  return resp.data;
}

export const useFetchAttendance = (
  query: Partial<TCellAttendanceQuery>
): IQueryHookResponse<Array<TCellAttendanceItem> | undefined> => {
  const meta = attendance.getCellAttendance(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
