import { useMemo, useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import { useFetchLeaders } from '@/hooks/admin/useFetchLeaders';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dateTimeUTC } from '@/utils/date';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const PERIODS = [
  { label: 'Last 7 days', value: '1' },
  { label: 'Last 30 days', value: '2' },
  { label: 'Last Year', value: '3' }
];

function PerfBadge({ value, present, total }: { value: number; present?: number; total?: number }) {
  const title = present !== undefined && total !== undefined
    ? `${present} present out of ${total} records`
    : undefined;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        title={title}
        className={cn(
          'inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold cursor-default',
          value >= 75 ? 'bg-green-100 text-green-700' :
          value >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        )}
      >
        {value.toFixed(1)}%
      </span>
      {present !== undefined && total !== undefined && (
        <span className="text-[9px] text-muted-foreground leading-none">{present}/{total}</span>
      )}
    </div>
  );
}

function LastLogin({ ts }: { ts: string | null }) {
  if (!ts) return <span className="text-muted-foreground italic text-xs">Never</span>;
  return <span className="text-xs whitespace-nowrap">{dateTimeUTC(ts)}</span>;
}

type Tab = 'zonal' | 'cell' | 'dept';

const ALL = '__all__';

const LeadersOverview = () => {
  const [period, setPeriod]   = useState('2');
  const [tab, setTab]         = useState<Tab>('zonal');
  const [search, setSearch]   = useState('');
  const [zoneFilter, setZoneFilter] = useState(ALL);
  const [deptFilter, setDeptFilter] = useState(ALL);

  const { data, isLoading, status } = useFetchLeaders(period);

  const q = search.toLowerCase().trim();

  const uniqueZones = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const l of data?.cellLeaders ?? []) {
      if (!seen.has(l.zoneId)) { seen.add(l.zoneId); result.push({ id: l.zoneId, name: l.zone }); }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.cellLeaders]);

  const uniqueDepts = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const l of data?.deptLeaders ?? []) {
      if (!seen.has(l.departmentId)) { seen.add(l.departmentId); result.push({ id: l.departmentId, name: l.department }); }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.deptLeaders]);

  const filteredZonal = useMemo(() => {
    return (data?.zonalLeaders ?? []).filter(l =>
      !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.zone.toLowerCase().includes(q)
    );
  }, [data?.zonalLeaders, q]);

  const cellGroupedByZone = useMemo(() => {
    const filtered = (data?.cellLeaders ?? []).filter(l => {
      const matchesSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.cell.toLowerCase().includes(q);
      const matchesZone   = zoneFilter === ALL || l.zoneId === zoneFilter;
      return matchesSearch && matchesZone;
    });
    const grouped: Record<string, { zoneName: string; leaders: typeof filtered }> = {};
    for (const l of filtered) {
      if (!grouped[l.zoneId]) grouped[l.zoneId] = { zoneName: l.zone, leaders: [] };
      grouped[l.zoneId].leaders.push(l);
    }
    return Object.entries(grouped).sort(([, a], [, b]) => a.zoneName.localeCompare(b.zoneName));
  }, [data?.cellLeaders, q, zoneFilter]);

  const filteredDeptLeaders = useMemo(() => {
    return (data?.deptLeaders ?? []).filter(l => {
      const matchesDept   = deptFilter === ALL || l.departmentId === deptFilter;
      const matchesSearch = !q
        || l.name.toLowerCase().includes(q)
        || l.email.toLowerCase().includes(q)
        || l.department.toLowerCase().includes(q)
        || l.assistants.some(a =>
            a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
          );
      return matchesDept && matchesSearch;
    });
  }, [data?.deptLeaders, q, deptFilter]);

  const totalDeptPeople = useMemo(() => {
    return (data?.deptLeaders ?? []).reduce((sum, l) => sum + 1 + l.assistants.length, 0);
  }, [data?.deptLeaders]);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'zonal', label: 'Zonal Leaders', count: data?.zonalLeaders.length },
    { key: 'cell',  label: 'Cell Leaders',  count: data?.cellLeaders.length  },
    { key: 'dept',  label: 'Dept Leaders',  count: totalDeptPeople }
  ];

  return (
    <Main>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leaders Overview</h2>
          <p className="text-muted-foreground">Last login activity and performance KPIs for all leaders</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <Button key={p.value} size="sm" variant={period === p.value ? 'default' : 'outline'} onClick={() => setPeriod(p.value)}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(''); setZoneFilter(ALL); setDeptFilter(ALL); }}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-t transition-colors',
              tab === t.key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
            {t.count != null && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Search + filter bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mt-3 mb-4">
        <Input
          placeholder={
            tab === 'zonal' ? 'Search by name, email or zone…'
            : tab === 'cell' ? 'Search by name, email or cell…'
            : 'Search by name, email or department…'
          }
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {tab === 'cell' && (
          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All zones</SelectItem>
              {uniqueZones.map(z => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {tab === 'dept' && (
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All departments</SelectItem>
              {uniqueDepts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : status === 'error' ? (
        <div className="flex h-60 items-center justify-center text-muted-foreground">
          <p className="text-sm">Could not load leaders data. The server may be starting up — try again shortly.</p>
        </div>
      ) : (
        <>
          {/* ── Zonal tab ─────────────────────────────────────────────── */}
          {tab === 'zonal' && (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead className="text-center">Cells</TableHead>
                    <TableHead className="text-center">Members</TableHead>
                    <TableHead className="text-center">Sun %</TableHead>
                    <TableHead className="text-center">Tue %</TableHead>
                    <TableHead className="text-center">Cell %</TableHead>
                    <TableHead>Last Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZonal.map((l, i) => {
                    const contrib = l.performance.contributingCells ?? 0;
                    const allCells = l.cellCount;
                    const partialData = contrib > 0 && contrib < allCells;
                    return (
                      <TableRow key={l.id}>
                        <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                        <TableCell>
                          <div className="font-medium">{l.name}</div>
                          <div className="text-xs text-muted-foreground">{l.email}</div>
                        </TableCell>
                        <TableCell>{l.zone}</TableCell>
                        <TableCell className="text-center">{l.cellCount}</TableCell>
                        <TableCell className="text-center">{l.memberCount}</TableCell>
                        <TableCell className="text-center">
                          <PerfBadge value={l.performance.sundayPct}  present={l.performance.sundayPresent}  total={l.performance.total} />
                          {partialData && (
                            <div className="text-[9px] text-amber-600 mt-0.5 whitespace-nowrap">{contrib}/{allCells} cells</div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <PerfBadge value={l.performance.tuesdayPct} present={l.performance.tuesdayPresent} total={l.performance.total} />
                        </TableCell>
                        <TableCell className="text-center">
                          <PerfBadge value={l.performance.cellPct}    present={l.performance.cellPresent}    total={l.performance.total} />
                        </TableCell>
                        <TableCell><LastLogin ts={l.lastLogin} /></TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredZonal.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">No results found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* ── Cell tab — grouped by zone ─────────────────────────────── */}
          {tab === 'cell' && (
            <div className="space-y-6">
              {cellGroupedByZone.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No results found.</div>
              ) : cellGroupedByZone.map(([zoneId, group]) => (
                <div key={zoneId}>
                  <h4 className="text-sm font-semibold mb-2 px-1 text-primary/80 uppercase tracking-wide">
                    Zone: {group.zoneName}
                    <span className="ml-2 text-xs text-muted-foreground font-normal normal-case">({group.leaders.length} leaders)</span>
                  </h4>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Cell</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-center">Members</TableHead>
                          <TableHead className="text-center">Sun %</TableHead>
                          <TableHead className="text-center">Tue %</TableHead>
                          <TableHead className="text-center">Cell %</TableHead>
                          <TableHead>Last Login</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.leaders.map((l, i) => (
                          <TableRow key={l.id + l.cell}>
                            <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                            <TableCell>
                              <div className="font-medium">{l.name}</div>
                              <div className="text-xs text-muted-foreground">{l.email}</div>
                            </TableCell>
                            <TableCell>{l.cell}</TableCell>
                            <TableCell>
                              <Badge variant={l.isAssistant ? 'secondary' : 'default'} className="text-[10px]">
                                {l.isAssistant ? 'Assistant' : 'Leader'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{l.memberCount}</TableCell>
                            <TableCell className="text-center"><PerfBadge value={l.performance.sundayPct}  present={l.performance.sundayPresent}  total={l.performance.total} /></TableCell>
                            <TableCell className="text-center"><PerfBadge value={l.performance.tuesdayPct} present={l.performance.tuesdayPresent} total={l.performance.total} /></TableCell>
                            <TableCell className="text-center"><PerfBadge value={l.performance.cellPct}    present={l.performance.cellPresent}    total={l.performance.total} /></TableCell>
                            <TableCell><LastLogin ts={l.lastLogin} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Dept tab — tree: leader row + indented assistant rows ───── */}
          {tab === 'dept' && (
            <div className="space-y-6">
              {filteredDeptLeaders.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No results found.</div>
              ) : filteredDeptLeaders.map(l => (
                <div key={l.id}>
                  <h4 className="text-sm font-semibold mb-2 px-1 text-primary/80 uppercase tracking-wide">
                    {l.department}
                    <span className="ml-2 text-xs font-normal normal-case text-muted-foreground">
                      (1 leader{l.assistants.length > 0 ? `, ${l.assistants.length} assistant${l.assistants.length !== 1 ? 's' : ''}` : ''})
                    </span>
                  </h4>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead className="text-center">Sun %</TableHead>
                          <TableHead className="text-center">Tue %</TableHead>
                          <TableHead className="text-center">Fri %</TableHead>
                          <TableHead className="text-center">Records</TableHead>
                          <TableHead>Last Login</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* ── Leader row — full performance ── */}
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">{l.name}</TableCell>
                          <TableCell>
                            <Badge variant="default" className="text-[10px]">Leader</Badge>
                          </TableCell>
                          <TableCell className="text-xs">{l.email}</TableCell>
                          <TableCell className="text-xs">{l.phone}</TableCell>
                          <TableCell className="text-center"><PerfBadge value={l.performance.sundayPct}  present={l.performance.sundayPresent}  total={l.performance.total} /></TableCell>
                          <TableCell className="text-center"><PerfBadge value={l.performance.tuesdayPct} present={l.performance.tuesdayPresent} total={l.performance.total} /></TableCell>
                          <TableCell className="text-center"><PerfBadge value={l.performance.cellPct}    present={l.performance.cellPresent}    total={l.performance.total} /></TableCell>
                          <TableCell className="text-center text-xs">{l.performance.total ?? 0}</TableCell>
                          <TableCell><LastLogin ts={l.lastLogin} /></TableCell>
                        </TableRow>
                        {/* ── Assistant sub-rows — personal details only, no performance ── */}
                        {l.assistants.map(a => (
                          <TableRow key={a.id} className="border-t-0">
                            <TableCell className="pl-7 text-sm text-muted-foreground">
                              <span className="mr-1.5 text-muted-foreground/50">└─</span>
                              {a.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-[10px]">Assistant</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{a.email}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{a.phone}</TableCell>
                            <TableCell colSpan={4} className="text-center text-xs text-muted-foreground italic">
                              — attendance tracked under leader —
                            </TableCell>
                            <TableCell><LastLogin ts={a.lastLogin} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Main>
  );
};

export default observer(LeadersOverview);
