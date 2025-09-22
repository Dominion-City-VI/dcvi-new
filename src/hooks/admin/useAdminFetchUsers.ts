import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIPaginatedServerRes<TAdminUserItem>) {
  return resp.data;
}

export const useAdminFetchUsers = (
  query: Partial<TGeneralQuery>
): IQueryHookResponse<TDCVIPaginatedRes<TAdminUserItem> | undefined> => {
  const meta = admin.getAllUsers(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
