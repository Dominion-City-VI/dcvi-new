'use client';
import { useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import { useFetchDeptAttendanceSummary } from '@/hooks/admin/useFetchDeptAttendanceSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { dateTimeUTC } from '@/utils/date';

const PERIODS = [
  { label: 'Last 7 days', value: '1' },
  { label: 'Last 30 days', value: '2' },
  { label: 'Last 365 days', value: '3' }
];

function KpiBadge({ value, label }: { value: number; label: string }) {
  const color =
    value >= 75 ? 'bg-green-100 text-green-800 border-green-300' :
    value >= 50 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                  'bg-red-100 text-red-800 border-red-300';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Badge variant="outline" className={cn('text-xs font-semibold px-2 py-0.5', color)}>
        {value.toFixed(1)}%
      </Badge>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

const DeptAttendanceOverview = () => {
  const [period, setPeriod] = useState('2');
  const { data, isLoading, status } = useFetchDeptAttendanceSummary({ period });

  return (
    <Main>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Department Attendance Overview</h2>
          <p className="text-muted-foreground">Attendance summary across all service units</p>
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

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : status === 'error' ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-sm">Could not load department attendance. The server may be starting up — please try again shortly.</p>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-sm">No department data found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map(dept => (
            <div key={dept.departmentId} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <Badge variant={dept.isActive ? 'default' : 'secondary'} className="text-[10px]">
                      {dept.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {dept.leader ? (
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p className="font-medium text-foreground">{dept.leader.name}</p>
                      <p>{dept.leader.email}</p>
                      {dept.leader.phone && <p>{dept.leader.phone}</p>}
                      {dept.leader.lastLogin && (
                        <p className="text-xs">Last login: {dateTimeUTC(dept.leader.lastLogin)}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No leader assigned</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <KpiBadge value={dept.summary.sundayPct} label="Sunday" />
                  <KpiBadge value={dept.summary.tuesdayPct} label="Tuesday" />
                  <KpiBadge value={dept.summary.overallPct} label="Overall" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-lg font-bold">{dept.summary.total}</span>
                    <span className="text-[10px] text-muted-foreground">Records</span>
                  </div>
                </div>
              </div>

              {dept.periodData.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="py-1 pr-4 text-left font-medium">Period</th>
                        <th className="py-1 pr-3 text-center font-medium">Total</th>
                        <th className="py-1 pr-3 text-center font-medium">Sun Present</th>
                        <th className="py-1 pr-3 text-center font-medium">Sun %</th>
                        <th className="py-1 pr-3 text-center font-medium">Tue Present</th>
                        <th className="py-1 text-center font-medium">Tue %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dept.periodData.map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-1 pr-4 font-medium">{row.label}</td>
                          <td className="py-1 pr-3 text-center">{row.total}</td>
                          <td className="py-1 pr-3 text-center">{row.sundayPresent}</td>
                          <td className="py-1 pr-3 text-center">
                            <span className={cn(
                              'font-semibold',
                              row.sundayPct >= 75 ? 'text-green-600' :
                              row.sundayPct >= 50 ? 'text-yellow-600' : 'text-red-600'
                            )}>
                              {row.sundayPct.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-1 pr-3 text-center">{row.tuesdayPresent}</td>
                          <td className="py-1 text-center">
                            <span className={cn(
                              'font-semibold',
                              row.tuesdayPct >= 75 ? 'text-green-600' :
                              row.tuesdayPct >= 50 ? 'text-yellow-600' : 'text-red-600'
                            )}>
                              {row.tuesdayPct.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Main>
  );
};

export default observer(DeptAttendanceOverview);
