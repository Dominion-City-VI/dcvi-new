import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { department } from './FetchKeyFactory';


function select(resp: IDCVIServerRes<Array<TDeptAttendanceItem>>) {
  return resp.data;
}

export const useFetchAttendance = (
  query: Partial<TCellAttendanceQuery>
): IQueryHookResponse<Array<TDeptAttendanceItem> | undefined> => {
  const meta = department.getDeptAttendance(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
