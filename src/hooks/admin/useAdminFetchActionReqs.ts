import { useCallback } from 'react';
import { admin } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIPaginatedServerRes<TAdminActionReqsItem>) {
  return resp.data;
}

export const useAdminFetchActionReqs = (
  query: Partial<TGeneralQuery>
): IQueryHookResponse<TDCVIPaginatedRes<TAdminActionReqsItem> | undefined> => {
  const meta = admin.getAllActionReqs(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
