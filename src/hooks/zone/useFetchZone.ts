import { useCallback } from 'react';
import { zone } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TGetZoneRes>) {
  return resp.data;
}

export const useFetchZones = (
  query: Partial<TZoneQuery>
): IQueryHookResponse<TGetZoneRes | undefined> => {
  const meta = zone.getZone(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
