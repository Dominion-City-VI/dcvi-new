import { useQuery } from '@tanstack/react-query';
import { phoneBook } from './fetchKeyFactory';
import { useCallback } from 'react';

function select(resp: IDCVIServerRes<TGetPhonebookContactsResp>) {
  return resp.data;
}

export function useFetchPBContacts(
  id: string
): IQueryHookResponse<TGetPhonebookContactsResp | undefined> {
  const meta = phoneBook.getPhonebookContacts(id);
  const memoizedSelect = useCallback(select, []);
  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    enabled: Boolean(id),
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
}
