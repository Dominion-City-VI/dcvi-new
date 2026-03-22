import { useState, useMemo } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lock, LockOpen, Search, ShieldOff } from 'lucide-react';
import { useFetchZonesOverview } from '@/hooks/admin/useFetchZonesOverview';
import { useFetchDeptOverview } from '@/hooks/admin/useFetchDeptOverview';
import { useFetchRestrictions, useAddRestriction, useRemoveRestriction } from '@/hooks/admin/useRestrictions';
import { cn } from '@/lib/utils';
import { toast as _toast } from 'sonner';
const toast = (opts: { title: string; description?: string; variant?: string }) => {
  if (opts.variant === 'destructive') _toast.error(opts.title, opts.description ? { description: opts.description } : undefined);
  else _toast.success(opts.title, opts.description ? { description: opts.description } : undefined);
};

type RestrictTarget = {
  entityType: 'cell' | 'dept';
  entityId: string;
  entityName: string;
};

function RestrictDialog({
  target,
  onClose,
  onConfirm
}: {
  target: RestrictTarget;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  return (
    <Dialog open onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restrict attendance filing</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{target.entityName}</span> will no longer
            be able to file attendance records. You can lift this restriction at any time.
          </p>
          <div>
            <Label>Reason (optional)</Label>
            <Textarea
              placeholder="e.g. Data audit in progress, pending review…"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => onConfirm(reason)}>
            <Lock size={14} className="mr-1.5" /> Restrict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RestrictionToggle({
  entityType,
  entityId,
  entityName,
  isRestricted,
  reason
}: {
  entityType: 'cell' | 'dept';
  entityId: string;
  entityName: string;
  isRestricted: boolean;
  reason?: string;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const addRestriction = useAddRestriction();
  const removeRestriction = useRemoveRestriction();
  const isPending = addRestriction.isPending || removeRestriction.isPending;

  const handleRestrict = (r: string) => {
    addRestriction.mutate(
      { entityType, entityId, entityName, reason: r },
      {
        onSuccess: () => {
          toast({ title: `${entityName} restricted`, description: 'They can no longer file attendance.' });
          setShowDialog(false);
        },
        onError: err => {
          toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
          setShowDialog(false);
        }
      }
    );
  };

  const handleLift = () => {
    removeRestriction.mutate(
      { entityType, entityId },
      {
        onSuccess: () => toast({ title: `Restriction lifted for ${entityName}` }),
        onError: err => toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' })
      }
    );
  };

  return (
    <>
      {isRestricted ? (
        <div className="flex items-center gap-2">
          {reason && (
            <span className="text-xs text-muted-foreground truncate max-w-[160px]" title={reason}>
              "{reason}"
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-300 hover:bg-green-50"
            disabled={isPending}
            onClick={handleLift}
          >
            <LockOpen size={13} className="mr-1" /> Lift restriction
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="text-red-700 border-red-200 hover:bg-red-50"
          disabled={isPending}
          onClick={() => setShowDialog(true)}
        >
          <Lock size={13} className="mr-1" /> Restrict
        </Button>
      )}
      {showDialog && (
        <RestrictDialog
          target={{ entityType, entityId, entityName }}
          onClose={() => setShowDialog(false)}
          onConfirm={handleRestrict}
        />
      )}
    </>
  );
}

const AttendanceRestrictions = () => {
  const [cellSearch, setCellSearch] = useState('');
  const [deptSearch, setDeptSearch] = useState('');

  const { data: zonesData, isLoading: zonesLoading } = useFetchZonesOverview('1');
  const { data: deptsData, isLoading: deptsLoading } = useFetchDeptOverview('1');
  const { data: restrictions, isLoading: restLoading } = useFetchRestrictions();

  const restrictionMap = useMemo(() => {
    const m = new Map<string, TRestrictionItem>();
    for (const r of restrictions) {
      m.set(`${r.entity_type}:${r.entity_id}`, r);
    }
    return m;
  }, [restrictions]);

  const allCells = useMemo(() => {
    if (!zonesData) return [];
    return zonesData.flatMap(z =>
      z.cells.map(c => ({ ...c, zoneName: z.name }))
    );
  }, [zonesData]);

  const filteredCells = useMemo(() => {
    const q = cellSearch.toLowerCase();
    return allCells.filter(c =>
      c.name.toLowerCase().includes(q) || c.zoneName?.toLowerCase().includes(q)
    );
  }, [allCells, cellSearch]);

  const filteredDepts = useMemo(() => {
    const q = deptSearch.toLowerCase();
    return (deptsData ?? []).filter(d => d.name.toLowerCase().includes(q));
  }, [deptsData, deptSearch]);

  const restrictedCells  = restrictions.filter(r => r.entity_type === 'cell').length;
  const restrictedDepts  = restrictions.filter(r => r.entity_type === 'dept').length;

  const isLoading = zonesLoading || deptsLoading || restLoading;

  return (
    <Main>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldOff size={20} className="text-red-600" />
          <h2 className="text-2xl font-bold tracking-tight">Attendance Restrictions</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Restrict specific cells or departments from filing attendance records. Restrictions take
          effect immediately and can be lifted at any time.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-4">
        <Badge variant="destructive" className="gap-1">
          <Lock size={11} /> {restrictedCells} cell{restrictedCells !== 1 ? 's' : ''} restricted
        </Badge>
        <Badge variant="destructive" className="gap-1">
          <Lock size={11} /> {restrictedDepts} dept{restrictedDepts !== 1 ? 's' : ''} restricted
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <Tabs defaultValue="cells">
          <TabsList className="mb-4">
            <TabsTrigger value="cells">Cells ({allCells.length})</TabsTrigger>
            <TabsTrigger value="depts">Departments ({(deptsData ?? []).length})</TabsTrigger>
          </TabsList>

          {/* ── Cells tab ── */}
          <TabsContent value="cells">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search cells or zones…"
                className="pl-8"
                value={cellSearch}
                onChange={e => setCellSearch(e.target.value)}
              />
            </div>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Cell</th>
                    <th className="px-4 py-2 text-left">Zone</th>
                    <th className="px-4 py-2 text-left">Leader</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCells.map((cell, idx) => {
                    const key = `cell:${cell.cellId}`;
                    const restriction = restrictionMap.get(key);
                    const isRestricted = !!restriction;
                    return (
                      <tr
                        key={cell.cellId}
                        className={cn(
                          'border-t',
                          idx % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                          isRestricted && 'bg-red-50 dark:bg-red-950/20'
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium">{cell.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{cell.zoneName}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {cell.leader ? `${cell.leader.firstName} ${cell.leader.lastName}` : '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          {isRestricted ? (
                            <Badge variant="destructive" className="gap-1 text-[10px]">
                              <Lock size={10} /> Restricted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-green-700 border-green-300">
                              Active
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <RestrictionToggle
                            entityType="cell"
                            entityId={cell.cellId}
                            entityName={cell.name}
                            isRestricted={isRestricted}
                            reason={restriction?.reason}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCells.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No cells found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── Departments tab ── */}
          <TabsContent value="depts">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search departments…"
                className="pl-8"
                value={deptSearch}
                onChange={e => setDeptSearch(e.target.value)}
              />
            </div>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Leader</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepts.map((dept, idx) => {
                    const key = `dept:${dept.departmentId}`;
                    const restriction = restrictionMap.get(key);
                    const isRestricted = !!restriction;
                    return (
                      <tr
                        key={dept.departmentId}
                        className={cn(
                          'border-t',
                          idx % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                          isRestricted && 'bg-red-50 dark:bg-red-950/20'
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium">{dept.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {dept.leader ? `${dept.leader.firstName} ${dept.leader.lastName}` : '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          {isRestricted ? (
                            <Badge variant="destructive" className="gap-1 text-[10px]">
                              <Lock size={10} /> Restricted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-green-700 border-green-300">
                              Active
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <RestrictionToggle
                            entityType="dept"
                            entityId={dept.departmentId}
                            entityName={dept.name}
                            isRestricted={isRestricted}
                            reason={restriction?.reason}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {filteredDepts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No departments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </Main>
  );
};

export default observer(AttendanceRestrictions);
