import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { department } from './FetchKeyFactory';

function selectDepartmentWithPeople(resp: IQueryHookResponse<PeopleData>) {
  return resp?.data;
}

export const useFetchDepartmentWithMembers = (
  id?: string,
  enabled: boolean = true
): IQueryHookResponse<PeopleData | undefined> => {
  const meta = department.getAllDeptsWithMembers(id  ?? '');
  const memoizedSelect = useCallback(selectDepartmentWithPeople, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled: enabled && !!id
  });

  return { data, isLoading, error, status };
};