import { useCallback } from 'react';
import { settings } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: Array<string>) {
  return resp;
}

export const useFetchDepartments = (): IQueryHookResponse<Array<string> | undefined> => {
  const meta = settings.getDepartments();
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
