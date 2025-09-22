import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wallet } from './FetchFactoryKey';

function select(resp: IDCVIServerRes<TTransactionLogRes>) {
  return resp.data;
}

export const useFetchTransLogs = (
  query: Partial<TGeneralQuery>
): IQueryHookResponse<TTransactionLogRes | undefined> => {
  const meta = wallet.getTransactionsLog(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
