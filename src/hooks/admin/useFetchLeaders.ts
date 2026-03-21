import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TLeadersOverview>) {
  return resp.data;
}

export const useFetchLeaders = (
  period: string
): IQueryHookResponse<TLeadersOverview | undefined> => {
  const meta = admin.getLeaders(period);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
