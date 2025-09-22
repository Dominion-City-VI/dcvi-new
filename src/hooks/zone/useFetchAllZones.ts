import { useCallback } from 'react';
import { zone } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIPaginatedServerRes<TAllZoneItem>) {
  return resp.data;
}

export const useFetchAllZones = (
  query: Partial<TZoneQuery>
): IQueryHookResponse<TDCVIPaginatedRes<TAllZoneItem> | undefined> => {
  const meta = zone.getAllZones(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
