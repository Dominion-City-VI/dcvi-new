import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admin } from './FetchKeyFactory';
import localServer from '@/servers/localServer';

// ── Fetch all restrictions ─────────────────────────────────────────────────
function selectRestrictions(resp: { ok: boolean; data: TRestrictionItem[] }) {
  return resp.data ?? [];
}

export const useFetchRestrictions = () => {
  const meta = admin.getRestrictions();
  const memoizedSelect = useCallback(selectRestrictions, []);

  const { data, isLoading, error, status } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect
  });

  return { data: data ?? [], isLoading, error, status };
};

// ── Check a single entity restriction ─────────────────────────────────────
function selectCheck(resp: { ok: boolean; restricted: boolean; data: TRestrictionItem | null }) {
  return { restricted: resp.restricted ?? false, data: resp.data ?? null } as TRestrictionCheck;
}

export const useCheckRestriction = (entityType: string, entityId: string | undefined) => {
  const meta = admin.checkRestriction(entityType, entityId ?? '');
  const memoizedSelect = useCallback(selectCheck, []);

  const { data, isLoading } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    enabled: !!entityId
  });

  return { data, isLoading };
};

// ── Add restriction mutation ───────────────────────────────────────────────
export const useAddRestriction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      entityType: 'cell' | 'dept';
      entityId: string;
      entityName: string;
      reason?: string;
    }) => localServer.post('/restrictions', payload).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/restrictions'] });
    }
  });
};

// ── Remove restriction mutation ────────────────────────────────────────────
export const useRemoveRestriction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityType, entityId }: { entityType: string; entityId: string }) =>
      localServer.delete(`/restrictions/${entityType}/${entityId}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/restrictions'] });
    }
  });
};

// ── Bulk restrict mutation ─────────────────────────────────────────────────
export const useBulkRestrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      entityType: 'cell' | 'dept';
      items: { entityId: string; entityName: string }[];
      reason?: string;
    }) => localServer.post('/restrictions/bulk', payload).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/restrictions'] });
    }
  });
};

// ── Bulk lift mutation ─────────────────────────────────────────────────────
export const useBulkLiftRestrictions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entityType: 'cell' | 'dept') =>
      localServer.delete(`/restrictions/bulk/${entityType}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/restrictions'] });
    }
  });
};
