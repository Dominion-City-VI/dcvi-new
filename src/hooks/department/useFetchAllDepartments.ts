import { useCallback } from 'react';
import { department } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: any) {
  console.log('Department API Response:', resp);
  if (resp?.data?.data && Array.isArray(resp.data.data)) {
    return resp.data.data;
  }
  if (resp?.data && Array.isArray(resp.data)) {
    return resp.data;
  }
  return [];
}

export const useFetchAllDepartments = (
): IQueryHookResponse<GetAllDepartment[] | undefined> => {
  const meta = department.getAllDepts();
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};