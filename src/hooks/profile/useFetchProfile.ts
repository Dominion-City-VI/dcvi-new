import { useQuery } from '@tanstack/react-query';
import { profile } from './FetchKeyFactory';
import { useCallback, useEffect } from 'react';
import store from 'store2';

const PROFILE_CACHE_KEY = 'dcvi__profile_cache';

export function clearProfileCache() {
  store.remove(PROFILE_CACHE_KEY);
}

function select(resp: IDCVIServerRes<TProfileInfo>) {
  return resp.data;
}

export function useFetchProfile(
  diabled: boolean = false
): IQueryHookResponse<TProfileInfo | undefined> {
  const meta = profile.getProfile();
  const memoizedSelect = useCallback(select, []);

  const cachedProfile = store.get(PROFILE_CACHE_KEY) as TProfileInfo | null;
  const initialData: IDCVIServerRes<TProfileInfo> | undefined = cachedProfile
    ? ({ data: cachedProfile, message: 'cached', status: true } as IDCVIServerRes<TProfileInfo>)
    : undefined;

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    enabled: !diabled,
    select: memoizedSelect,
    initialData,
    initialDataUpdatedAt: 0
  });

  useEffect(() => {
    if (data) {
      store.set(PROFILE_CACHE_KEY, data);
    }
  }, [data]);

  return { data, isLoading, error, status };
}
