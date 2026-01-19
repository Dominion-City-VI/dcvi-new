import { useCallback } from 'react';
import { department } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';


type ApiEnvelope<T> = { data?: T };
type NestedApiEnvelope<T> = { data?: ApiEnvelope<T> };

// Handles APIs that return either:
// 1) { data: { data: PeopleData[] } }
// 2) { data: PeopleData[] }
function selectDepartments(resp: ApiEnvelope<PeopleData[]> | NestedApiEnvelope<PeopleData[]>) {
  console.log('Department API Response:', resp);

  const nested = (resp as NestedApiEnvelope<PeopleData[]>)?.data?.data;
  if (Array.isArray(nested)) return nested;

  const direct = (resp as ApiEnvelope<PeopleData[]>)?.data;
  if (Array.isArray(direct)) return direct;

  return [];
}

export const useFetchAllDepartmentsWithPeople = (
): IQueryHookResponse<PeopleData[] | undefined> => {
  const meta = department.getAllDeptsWithPeople();
  const memoizedSelect = useCallback(selectDepartments, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};