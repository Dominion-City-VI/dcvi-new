'use client';
import { useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import { useFetchLeaders } from '@/hooks/admin/useFetchLeaders';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { dateTimeUTC } from '@/utils/date';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const PERIODS = [
  { label: 'Last 7 days', value: '1' },
  { label: 'Last 30 days', value: '2' },
  { label: 'Last Year', value: '3' }
];

function PerfBadge({ value }: { value: number }) {
  return (
    <span className={cn(
      'inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold',
      value >= 75 ? 'bg-green-100 text-green-700' :
      value >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
    )}>
      {value.toFixed(1)}%
    </span>
  );
}

function LastLogin({ ts }: { ts: string | null }) {
  if (!ts) return <span className="text-muted-foreground italic text-xs">Never</span>;
  return <span className="text-xs whitespace-nowrap">{dateTimeUTC(ts)}</span>;
}

type Tab = 'zonal' | 'cell' | 'dept';

const LeadersOverview = () => {
  const [period, setPeriod] = useState('2');
  const [tab, setTab] = useState<Tab>('zonal');
  const { data, isLoading, status } = useFetchLeaders(period);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'zonal', label: 'Zonal Leaders', count: data?.zonalLeaders.length },
    { key: 'cell',  label: 'Cell Leaders',  count: data?.cellLeaders.length  },
    { key: 'dept',  label: 'Dept Leaders',  count: data?.deptLeaders.length  }
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
            <Button
              key={p.value}
              size="sm"
              variant={period === p.value ? 'default' : 'outline'}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-4 border-b pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-t transition-colors',
              tab === t.key
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
            {t.count != null && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : status === 'error' ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-sm">Could not load leaders data. The server may be starting up — please try again shortly.</p>
        </div>
      ) : (
        <>
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
                  {(data?.zonalLeaders ?? []).map((l, i) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">{l.email}</div>
                      </TableCell>
                      <TableCell>{l.zone}</TableCell>
                      <TableCell className="text-center">{l.cellCount}</TableCell>
                      <TableCell className="text-center">{l.memberCount}</TableCell>
                      <TableCell className="text-center"><PerfBadge value={l.performance.sundayPct} /></TableCell>
                      <TableCell className="text-center"><PerfBadge value={l.performance.tuesdayPct} /></TableCell>
                      <TableCell className="text-center"><PerfBadge value={l.performance.cellPct} /></TableCell>
                      <TableCell><LastLogin ts={l.lastLogin} /></TableCell>
                    </TableRow>
                  ))}
                  {(data?.zonalLeaders ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">No zonal leaders found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {tab === 'cell' && (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Cell</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Members</TableHead>
                    <TableHead className="text-center">Sun %</TableHead>
                    <TableHead className="text-center">Tue %</TableHead>
                    <TableHead className="text-center">Cell %</TableHead>
                    <TableHead>Last Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.cellLeaders ?? []).map((l, i) => (
                    <TableRow key={l.id + l.cell}>
                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">{l.email}</div>
                      </TableCell>
                      <TableCell>{l.cell}</TableCell>
                      <TableCell>{l.zone}</TableCell>
                      <TableCell>
                        <Badge variant={l.isAssistant ? 'secondary' : 'default'} className="text-[10px]">
                          {l.isAssistant ? 'Assistant' : 'Leader'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{l.memberCount}</TableCell>
                      <TableCell className="text-center"><PerfBadge value={l.performance.sundayPct} /></TableCell>
                      <TableCell className="text-center"><PerfBadge value={l.performance.tuesdayPct} /></TableCell>
                      <TableCell className="text-center"><PerfBadge value={l.performance.cellPct} /></TableCell>
                      <TableCell><LastLogin ts={l.lastLogin} /></TableCell>
                    </TableRow>
                  ))}
                  {(data?.cellLeaders ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center h-24 text-muted-foreground">No cell leaders found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {tab === 'dept' && (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Last Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.deptLeaders ?? []).map((l, i) => (
                    <TableRow key={l.id + l.department}>
                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell>{l.department}</TableCell>
                      <TableCell>
                        <Badge variant={l.isAssistant ? 'secondary' : 'default'} className="text-[10px]">
                          {l.isAssistant ? 'Assistant' : 'Leader'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{l.email}</TableCell>
                      <TableCell className="text-xs">{l.phone}</TableCell>
                      <TableCell><LastLogin ts={l.lastLogin} /></TableCell>
                    </TableRow>
                  ))}
                  {(data?.deptLeaders ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">No department leaders found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </Main>
  );
};

export default observer(LeadersOverview);
