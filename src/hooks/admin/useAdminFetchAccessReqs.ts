import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIPaginatedServerRes<TAdminAccessReqsItem>) {
  return resp.data;
}

export const useAdminFetchAccessReqs = (
  query: Partial<TGeneralQuery>
): IQueryHookResponse<TDCVIPaginatedRes<TAdminAccessReqsItem> | undefined> => {
  const meta = admin.getAllAccessReqs(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
