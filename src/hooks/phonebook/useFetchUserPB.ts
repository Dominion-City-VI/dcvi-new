import { useQuery } from '@tanstack/react-query';
import { phoneBook } from './fetchKeyFactory';
import { useCallback } from 'react';

function select(resp: IDCVIServerRes<Array<TGetPhonebookResp>>) {
  return resp.data;
}

export function useFetchUserPB(
  query: Partial<TGetPhonebookQuery>
): IQueryHookResponse<Array<TGetPhonebookResp> | undefined> {
  const meta = phoneBook.getUserPhoneBooks(query);
  const memoizedSelect = useCallback(select, []);
  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    enabled: true,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
}
