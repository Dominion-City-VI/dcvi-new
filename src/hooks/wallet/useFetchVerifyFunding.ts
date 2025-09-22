import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wallet } from './FetchFactoryKey';
import { TVerifyFundingTrx } from '@/routes/_authenticated/wallet/funding';

function select(resp: IDCVIServerRes<TFundingConfirmation>) {
  return resp.data;
}

export const useFetchVerifyFunding = (
  query: TVerifyFundingTrx
): IQueryHookResponse<TFundingConfirmation | undefined> => {
  const meta = wallet.getVerifyFunding(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
