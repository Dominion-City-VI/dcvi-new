// import { useCallback } from 'react';
// import { department } from './FetchKeyFactory';
// import { useQuery } from '@tanstack/react-query';

// function select(resp: { result: IDCVIServerRes<TGetSingleCellMember> }) {
//   return resp.result.data;
// }

// export const useFetchDepartmentUser = (
//   id: string
// ): IQueryHookResponse<TGetSingleCellMember | undefined> => {
//   const meta = department.getUser(id);
//   const memoizedSelect = useCallback(select, []);

//   const { data, isLoading, error, status } = useQuery({
//     queryKey: meta.keys(),
//     meta,
//     select: memoizedSelect,
//     enabled: Boolean(id)
//   });

//   return { data, isLoading, error, status };
// };

import { useCallback } from 'react';
import { department } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IQueryHookResponse<TGetSingleCellMember> ) {
  return resp?.data;
}

// export const useFetchDepartmentUser = (
//   id: string
// ): IQueryHookResponse<TGetSingleCellMember | undefined> => {
//   const meta = department.getUser(id);
//   const memoizedSelect = useCallback(select, []);

//   const { data, isLoading, error, status } = useQuery({
//     queryKey: meta.keys(),
//     queryFn: () => fetch(meta.path).then(res => res.json()), // Use meta.path to construct the fetch
//     meta,
//     select: memoizedSelect,
//     enabled: Boolean(id)
//   });

//   return { data, isLoading, error, status };
// };

export const useFetchDepartmentUser = (
  id?: string,
  enabled: boolean = true
): IQueryHookResponse<TGetSingleCellMember | undefined> => {
  const meta = department.getUser(id  ?? '');
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled: enabled && !!id
  });

  return { data, isLoading, error, status };
};