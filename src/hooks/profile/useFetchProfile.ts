import { useQuery } from '@tanstack/react-query';
import { profile } from './FetchKeyFactory';
import { useCallback } from 'react';

function select(resp: IDCVIServerRes<TProfileInfo>) {
  return resp.data;
}

export function useFetchProfile(
  diabled: boolean = false
): IQueryHookResponse<TProfileInfo | undefined> {
  const meta = profile.getProfile();
  const memoizedSelect = useCallback(select, []);
  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    enabled: !diabled,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
}
