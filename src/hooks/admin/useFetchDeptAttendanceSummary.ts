import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

type TDeptAttSummaryQuery = { period?: string; StartAt?: string; EndAt?: string };

function select(resp: IDCVIServerRes<TDeptAttendanceSummaryItem[]>) {
  return resp.data;
}

export const useFetchDeptAttendanceSummary = (
  query: TDeptAttSummaryQuery
): IQueryHookResponse<TDeptAttendanceSummaryItem[] | undefined> => {
  const meta = admin.getDeptAttendanceSummary(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
