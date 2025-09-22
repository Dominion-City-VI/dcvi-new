import { useQuery } from '@tanstack/react-query';
import { zone } from './FetchKeyFactory';
import { useCallback } from 'react';

function select(resp: IDCVIServerRes<TZoneAnalyticsResp>) {
  return resp.data;
}

export const useFetchZoneAnalytics = (
  query: TZoneAnalyticsQuery
): IQueryHookResponse<TZoneAnalyticsResp | undefined> => {
  const meta = zone.getZoneAnalytics(query);
  const memoizedSelect = useCallback(select, []);

  const { data, status, isLoading, error } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, status, isLoading, error };
};
