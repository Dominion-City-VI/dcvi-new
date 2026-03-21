import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TDeptOverviewItem[]>) {
  return resp.data;
}

export const useFetchDeptOverview = (
  period: string
): IQueryHookResponse<TDeptOverviewItem[] | undefined> => {
  const meta = admin.getDeptOverview(period);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
