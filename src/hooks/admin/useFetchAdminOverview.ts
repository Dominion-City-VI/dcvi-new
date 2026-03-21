import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TAdminOverview>) {
  return resp.data;
}

export const useFetchAdminOverview = (
  period: string
): IQueryHookResponse<TAdminOverview | undefined> => {
  const meta = admin.getOverview(period);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
