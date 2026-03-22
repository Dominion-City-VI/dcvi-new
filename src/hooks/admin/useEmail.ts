import { useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { admin } from './FetchKeyFactory';
import localServer from '@/servers/localServer';

// ── Fetch email recipients ─────────────────────────────────────────────────
function selectRecipients(resp: { ok: boolean; data: TEmailRecipients }) {
  return resp.data;
}

export const useFetchEmailRecipients = () => {
  const meta = admin.getEmailRecipients();
  const memoizedSelect = useCallback(selectRecipients, []);

  const { data, isLoading, error } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    staleTime: 1000 * 60 * 10
  });

  return { data, isLoading, error };
};

// ── Fetch email logs ───────────────────────────────────────────────────────
function selectLogs(resp: { ok: boolean; data: TEmailLog[] }) {
  return resp.data ?? [];
}

export const useFetchEmailLogs = () => {
  const meta = admin.getEmailLogs();
  const memoizedSelect = useCallback(selectLogs, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: meta.keys(),
    meta,
    select: memoizedSelect,
    staleTime: 0
  });

  return { data: data ?? [], isLoading, refetch };
};

// ── Send email mutation ────────────────────────────────────────────────────
export const useSendEmail = () => {
  return useMutation({
    mutationFn: (payload: {
      subject: string;
      bodyHtml: string;
      recipientGroups: TEmailRecipientGroup[];
      individualRecipients?: { email: string; name: string }[];
      attachments?: TEmailAttachment[];
    }) => localServer.post('/email/send', payload).then(r => r.data)
  });
};

// ── AI draft mutation ──────────────────────────────────────────────────────
export const useAiDraft = () => {
  return useMutation({
    mutationFn: (payload: {
      prompt: string;
      currentContent?: string;
      action?: 'generate' | 'improve' | 'shorten' | 'formalize';
    }) => localServer.post('/email/ai-draft', payload).then(r => r.data)
  });
};
