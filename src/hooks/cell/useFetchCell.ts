import { useCallback } from 'react';
import { cell } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TGetCellRes>) {
  return resp.data;
}

export const useFetchCells = (
  query: Partial<TCellQuery>,
  enabled: boolean
): IQueryHookResponse<TGetCellRes | undefined> => {
  const meta = cell.getCell(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled
  });

  return { data, isLoading, error, status };
};
