import { useCallback } from 'react';
import { zone } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TSingleZoneRes>) {
  return resp.data;
}

export const useFetchZoneById = (id: string): IQueryHookResponse<TSingleZoneRes | undefined> => {
  const meta = zone.getZoneById(id);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled: Boolean(id)
  });

  return { data, isLoading, error, status };
};
