import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

export const RolesEnumMock = [
  'SeniorPastor',
  'Pastor',
  'DistrictPastor',
  'ZonalPastor',
  'CellLeader',
  'AssistantCellLeader',
  'DepartmentalHead',
  'AssistantDepartmentalHead',
  'SubAdmin',
];

function select(resp: Array<string>) {
  return resp;
}

export const useFetchRoles = (): IQueryHookResponse<Array<string> | undefined> => {
  const meta = {
    keys: () => ['roles'],
    getRoles: () => RolesEnumMock,
  };

  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    queryFn: meta.getRoles,
    select: memoizedSelect,
  });

  return { data, isLoading, error, status };
};
