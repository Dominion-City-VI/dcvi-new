import { useCallback } from 'react';
import { cell } from './FetchKeyFactory';
import { useQuery } from '@tanstack/react-query';

function select(resp: IDCVIServerRes<TGetCellMemberResp>) {
  return resp.data;
}

export const useFetchCellMembers = (
  query: Partial<TCellMemberQuery>
): IQueryHookResponse<TGetCellMemberResp | undefined> => {
  const meta = cell.getCellMember(query);
  const memoizedSelect = useCallback(select, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data, isLoading, error, status };
};
