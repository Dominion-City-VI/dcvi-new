import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sms } from './fetchKeyFactory';

function select(resp: IDCVIServerRes<TDCVIPaginatedRes<TSMSLogItem>>) {
  return resp.data;
}

export const useFetchSMSLogs = (
  query: Partial<TSMSLogQuery>
): IQueryHookResponse<TDCVIPaginatedRes<TSMSLogItem> | undefined> => {
  const meta = sms.getSMSLog(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
