import { useCallback } from 'react';
import { attendance } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TCellAttendanceServiceSummary>) {
  return resp.data;
}

export const useFetchServiceSummary = (
  query: Partial<TCellAttendanceSummaryQuery>,
  enabled: boolean
): IQueryHookResponse<TCellAttendanceServiceSummary | undefined> => {
  const meta = attendance.getServiceSummary(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled
  });

  return { data, isLoading, error, status };
};
