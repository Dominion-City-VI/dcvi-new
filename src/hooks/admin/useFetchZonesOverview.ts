import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TZoneOverviewItem[]>) {
  return resp.data;
}

export const useFetchZonesOverview = (
  period: string
): IQueryHookResponse<TZoneOverviewItem[] | undefined> => {
  const meta = admin.getZonesOverview(period);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
