import { useCallback } from 'react';
import { cell } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TCellAnalyticsResp>) {
  return resp.data;
}

export const useFetchCellAnalytics = (
  query: TCellAnalyticsQuery,
  id?: string
): IQueryHookResponse<TCellAnalyticsResp | undefined> => {
  const meta = cell.getCellAnalytics(query, id);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled: Boolean(id)
  });

  return { data, isLoading, error, status };
};
