import { useState, useMemo, useRef, useCallback } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Mail, Send, Sparkles, Users, X, Search, Paperclip,
  RefreshCw, ChevronDown, ChevronUp, Eye, EyeOff,
  Wand2, AlignLeft, Maximize2, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast as _toast } from 'sonner';
import { useFetchEmailRecipients, useFetchEmailLogs, useSendEmail, useAiDraft } from '@/hooks/admin/useEmail';

const toast = (opts: { title: string; description?: string; variant?: string }) => {
  if (opts.variant === 'destructive') _toast.error(opts.title, opts.description ? { description: opts.description } : undefined);
  else _toast.success(opts.title, opts.description ? { description: opts.description } : undefined);
};

// ── Recipient Row ────────────────────────────────────────────────────────────
function RecipientRow({
  label, sublabel, checked, onToggle
}: { label: string; sublabel?: string; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 accent-primary"
      />
      <div className="min-w-0">
        <p className="text-sm leading-tight truncate">{label}</p>
        {sublabel && <p className="text-[11px] text-muted-foreground truncate">{sublabel}</p>}
      </div>
    </label>
  );
}

// ── Email log row ────────────────────────────────────────────────────────────
function LogRow({ log }: { log: TEmailLog }) {
  const date = new Date(log.created_at).toLocaleString();
  return (
    <div className="flex items-start justify-between py-2 border-b last:border-0 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{log.subject}</p>
        <p className="text-xs text-muted-foreground">{date} · {log.recipient_count} recipient{log.recipient_count !== 1 ? 's' : ''}</p>
        {log.error_msg && <p className="text-xs text-red-600 mt-0.5">{log.error_msg}</p>}
      </div>
      <Badge
        variant={log.status === 'sent' ? 'outline' : 'destructive'}
        className={cn('shrink-0 capitalize', log.status === 'sent' && 'text-green-700 border-green-300')}
      >
        {log.status}
      </Badge>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const EmailComposer = () => {
  const { data: recipients, isLoading: recipLoading } = useFetchEmailRecipients();
  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useFetchEmailLogs();
  const sendEmail = useSendEmail();
  const aiDraft = useAiDraft();

  // ── Recipient selection ──────────────────────────────────────────────────
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  // ── Email fields ────────────────────────────────────────────────────────
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [attachments, setAttachments] = useState<TEmailAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── AI assistant ─────────────────────────────────────────────────────────
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiAction, setAiAction] = useState<'generate' | 'improve' | 'shorten' | 'formalize'>('generate');

  // ── Recipient list helpers ───────────────────────────────────────────────
  const q = recipientSearch.toLowerCase();

  const zoneLeaderRows = useMemo(() => {
    return (recipients?.zones ?? []).filter(z =>
      z.name.toLowerCase().includes(q) || z.leader_name?.toLowerCase().includes(q)
    ).map(z => ({
      key: `zone-leader:${z.id}`,
      label: z.leader_name || 'No leader',
      sublabel: `Zone Leader — ${z.name}`,
      group: { type: 'zone' as const, id: z.id }
    }));
  }, [recipients, q]);

  const cellLeaderRows = useMemo(() => {
    return (recipients?.cells ?? []).filter(c =>
      c.name.toLowerCase().includes(q) || c.zone_name?.toLowerCase().includes(q) ||
      c.leader_name?.toLowerCase().includes(q)
    ).map(c => ({
      key: `cell-leader:${c.id}`,
      label: c.leader_name || 'No leader',
      sublabel: `Cell Leader — ${c.name} (${c.zone_name})`,
      group: { type: 'cell' as const, id: c.id }
    }));
  }, [recipients, q]);

  const deptLeaderRows = useMemo(() => {
    return (recipients?.depts ?? []).filter(d =>
      d.name.toLowerCase().includes(q) || d.leader_name?.toLowerCase().includes(q)
    ).map(d => ({
      key: `dept-leader:${d.id}`,
      label: d.leader_name || 'No leader',
      sublabel: `Dept Leader — ${d.name}`,
      group: { type: 'dept' as const, id: d.id }
    }));
  }, [recipients, q]);

  const individualRows = useMemo(() => {
    return (recipients?.users ?? []).filter(u =>
      u.name.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    ).map(u => ({
      key: `user:${u.id}`,
      label: u.name,
      sublabel: u.email,
      group: { type: 'user' as const, id: u.id }
    }));
  }, [recipients, q]);

  const toggle = useCallback((key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const allRows = useMemo(
    () => [...zoneLeaderRows, ...cellLeaderRows, ...deptLeaderRows, ...individualRows],
    [zoneLeaderRows, cellLeaderRows, deptLeaderRows, individualRows]
  );

  const selectedRows = useMemo(
    () => allRows.filter(r => selectedKeys.has(r.key)),
    [allRows, selectedKeys]
  );

  // Bulk selectors
  const selectAllZoneLeaders = () => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      zoneLeaderRows.forEach(r => next.add(r.key));
      return next;
    });
  };
  const selectAllCellLeaders = () => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      cellLeaderRows.forEach(r => next.add(r.key));
      return next;
    });
  };
  const selectAllDeptLeaders = () => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      deptLeaderRows.forEach(r => next.add(r.key));
      return next;
    });
  };

  // ── Attachment handler ───────────────────────────────────────────────────
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const base64 = (e.target?.result as string).split(',')[1];
        setAttachments(prev => [...prev, { filename: file.name, content: base64 }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (i: number) =>
    setAttachments(prev => prev.filter((_, idx) => idx !== i));

  // ── AI draft ─────────────────────────────────────────────────────────────
  const runAi = () => {
    if (!aiPrompt.trim() && aiAction === 'generate') {
      toast({ title: 'Enter a prompt first', variant: 'destructive' });
      return;
    }
    aiDraft.mutate(
      { prompt: aiPrompt, currentContent: bodyHtml, action: aiAction },
      {
        onSuccess: r => {
          if (r.ok && r.content) {
            setBodyHtml(r.content);
            toast({ title: 'AI content generated', description: 'Review and edit before sending.' });
          } else {
            toast({ title: 'AI assistant unavailable', description: r.error, variant: 'destructive' });
          }
        },
        onError: err => toast({ title: 'AI error', description: (err as Error).message, variant: 'destructive' })
      }
    );
  };

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!subject.trim()) { toast({ title: 'Subject is required', variant: 'destructive' }); return; }
    if (!bodyHtml.trim()) { toast({ title: 'Email body is required', variant: 'destructive' }); return; }
    if (selectedRows.length === 0) { toast({ title: 'Select at least one recipient', variant: 'destructive' }); return; }

    const recipientGroups: TEmailRecipientGroup[] = selectedRows.map(r => r.group);

    sendEmail.mutate(
      { subject, bodyHtml, recipientGroups, attachments },
      {
        onSuccess: r => {
          if (r.ok) {
            toast({ title: `Email sent to ${r.sentCount} recipient${r.sentCount !== 1 ? 's' : ''}!` });
            setSubject('');
            setBodyHtml('');
            setSelectedKeys(new Set());
            setAttachments([]);
            refetchLogs();
            setShowLogs(true);
          } else {
            toast({ title: 'Send failed', description: r.error, variant: 'destructive' });
          }
        },
        onError: err => toast({ title: 'Send error', description: (err as Error).message, variant: 'destructive' })
      }
    );
  };

  const RecipientList = ({ rows, bulkLabel, onBulkSelect }: {
    rows: typeof allRows;
    bulkLabel?: string;
    onBulkSelect?: () => void;
  }) => (
    <div className="flex flex-col gap-0.5">
      {bulkLabel && (
        <div className="flex justify-end pb-1">
          <button
            onClick={onBulkSelect}
            className="text-xs text-primary hover:underline"
          >
            Select all {rows.length}
          </button>
        </div>
      )}
      {rows.map(r => (
        <RecipientRow
          key={r.key}
          label={r.label}
          sublabel={r.sublabel}
          checked={selectedKeys.has(r.key)}
          onToggle={() => toggle(r.key)}
        />
      ))}
      {rows.length === 0 && (
        <p className="text-xs text-muted-foreground py-4 text-center">No results.</p>
      )}
    </div>
  );

  return (
    <Main>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Mail size={20} className="text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Email Composer</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Send targeted emails to church leaders, zones, cells, departments, or individuals — with AI assistance.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* ── LEFT: Recipient selector ────────────────────────────────── */}
        <div className="lg:col-span-2 rounded-lg border bg-card shadow-sm flex flex-col h-fit">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <Users size={14} /> Recipients
                {selectedRows.length > 0 && (
                  <Badge className="ml-1 text-[10px]">{selectedRows.length}</Badge>
                )}
              </h3>
              {selectedRows.length > 0 && (
                <button
                  onClick={() => setSelectedKeys(new Set())}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search recipients…"
                value={recipientSearch}
                onChange={e => setRecipientSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          {/* Selected chips */}
          {selectedRows.length > 0 && (
            <div className="px-4 py-2 border-b flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {selectedRows.map(r => (
                <Badge key={r.key} variant="secondary" className="gap-1 text-xs max-w-[180px]">
                  <span className="truncate">{r.label}</span>
                  <button onClick={() => toggle(r.key)} className="ml-0.5 hover:text-destructive shrink-0">
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {recipLoading ? (
            <div className="p-4 space-y-2">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[500px]">
              <Tabs defaultValue="zoneLeaders">
                <div className="px-2 pt-2">
                  <TabsList className="w-full grid grid-cols-2 h-auto gap-1 p-1">
                    <TabsTrigger value="zoneLeaders" className="text-xs">Zone Leaders</TabsTrigger>
                    <TabsTrigger value="cellLeaders" className="text-xs">Cell Leaders</TabsTrigger>
                    <TabsTrigger value="deptLeaders" className="text-xs">Dept Leaders</TabsTrigger>
                    <TabsTrigger value="individuals" className="text-xs">Individuals</TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-2">
                  <TabsContent value="zoneLeaders">
                    <RecipientList rows={zoneLeaderRows} bulkLabel="Zone Leaders" onBulkSelect={selectAllZoneLeaders} />
                  </TabsContent>
                  <TabsContent value="cellLeaders">
                    <RecipientList rows={cellLeaderRows} bulkLabel="Cell Leaders" onBulkSelect={selectAllCellLeaders} />
                  </TabsContent>
                  <TabsContent value="deptLeaders">
                    <RecipientList rows={deptLeaderRows} bulkLabel="Dept Leaders" onBulkSelect={selectAllDeptLeaders} />
                  </TabsContent>
                  <TabsContent value="individuals">
                    <RecipientList rows={individualRows} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>

        {/* ── RIGHT: Email composer ───────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Subject */}
          <div>
            <Label className="text-xs mb-1 block">Subject</Label>
            <Input
              placeholder="Email subject…"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          {/* AI assistant panel */}
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAiPanel(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles size={14} /> AI Writing Assistant
              </span>
              {showAiPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAiPanel && (
              <div className="px-4 pb-4 border-t pt-3 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { action: 'generate' as const, icon: Wand2, label: 'Generate draft' },
                    { action: 'improve' as const, icon: Sparkles, label: 'Improve' },
                    { action: 'shorten' as const, icon: AlignLeft, label: 'Shorten' },
                    { action: 'formalize' as const, icon: Maximize2, label: 'Formalize' }
                  ].map(({ action, icon: Icon, label }) => (
                    <button
                      key={action}
                      onClick={() => setAiAction(action)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-colors',
                        aiAction === action
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-muted border-border'
                      )}
                    >
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>

                {(aiAction === 'generate' || aiAction === 'improve') && (
                  <div>
                    <Textarea
                      placeholder={
                        aiAction === 'generate'
                          ? 'Describe the email you want to send, e.g. "A reminder for leaders to submit their attendance reports for this week..."'
                          : 'Describe how to improve the current email…'
                      }
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      className="resize-none text-sm"
                      rows={3}
                    />
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={runAi}
                  disabled={aiDraft.isPending}
                  className="gap-2"
                >
                  {aiDraft.isPending
                    ? <><RefreshCw size={13} className="animate-spin" /> Generating…</>
                    : <><Sparkles size={13} /> {aiAction === 'generate' ? 'Generate' : aiAction === 'improve' ? 'Improve' : aiAction === 'shorten' ? 'Shorten' : 'Formalize'}</>
                  }
                </Button>
              </div>
            )}
          </div>

          {/* Email body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs">Email body (HTML supported)</Label>
              <button
                onClick={() => setShowPreview(v => !v)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {showPreview ? (
              <div
                className="min-h-[240px] rounded-md border bg-white p-4 text-sm overflow-auto"
                dangerouslySetInnerHTML={{ __html: bodyHtml || '<em style="color:#888">No content to preview.</em>' }}
              />
            ) : (
              <Textarea
                placeholder="Write your email here, or use the AI assistant to generate a draft…"
                value={bodyHtml}
                onChange={e => setBodyHtml(e.target.value)}
                className="resize-none font-mono text-sm min-h-[240px]"
                rows={12}
              />
            )}
          </div>

          {/* Attachments */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Paperclip size={13} /> Attach images / flyers
            </Button>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map((a, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 pr-1 text-xs">
                    {a.filename.startsWith('data:image') || a.filename.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? '🖼️' : '📎'}{' '}
                    <span className="max-w-[120px] truncate">{a.filename}</span>
                    <button onClick={() => removeAttachment(i)} className="ml-1 hover:text-destructive">
                      <X size={10} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={sendEmail.isPending}
            className="gap-2 self-start"
            size="lg"
          >
            {sendEmail.isPending
              ? <><RefreshCw size={15} className="animate-spin" /> Sending…</>
              : <><Send size={15} /> Send to {selectedRows.length || 0} recipient{selectedRows.length !== 1 ? 's' : ''}</>
            }
          </Button>
        </div>
      </div>

      {/* ── Email logs ──────────────────────────────────────────────────── */}
      <div className="mt-6 rounded-lg border bg-card shadow-sm overflow-hidden">
        <button
          onClick={() => { setShowLogs(v => !v); if (!showLogs) refetchLogs(); }}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Clock size={14} /> Email History ({logs.length})
          </span>
          {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showLogs && (
          <div className="border-t px-4 py-2 max-h-72 overflow-y-auto">
            {logsLoading ? (
              <div className="space-y-2 py-2">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : logs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No emails sent yet.</p>
            ) : (
              logs.map(log => <LogRow key={log.id} log={log} />)
            )}
          </div>
        )}
      </div>
    </Main>
  );
};

export default observer(EmailComposer);
