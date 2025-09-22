import { useCallback } from 'react';
import { attendance } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TCellAttendanceStatusSummary>) {
  return resp.data;
}

export const useFetchStatusSummary = (
  query: Partial<TCellAttendanceSummaryQuery>,
  enabled: boolean
): IQueryHookResponse<TCellAttendanceStatusSummary | undefined> => {
  const meta = attendance.getStatusSummary(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled
  });

  return { data, isLoading, error, status };
};
