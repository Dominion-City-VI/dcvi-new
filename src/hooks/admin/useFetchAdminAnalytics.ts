import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TCellAnalyticsResp>) {
  return resp.data;
}

export const useFetchAdminAnalytics = (
  query: TCellAnalyticsQuery
): IQueryHookResponse<TCellAnalyticsResp | undefined> => {
  const meta = admin.getAnalytics(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
