import { useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import { useFetchAdminOverview } from '@/hooks/admin/useFetchAdminOverview';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

const PERIODS = [
  { label: '7 days',  value: '1' },
  { label: '30 days', value: '2' },
  { label: '1 year',  value: '3' }
];

const COLORS = {
  sunday:  '#6366f1',
  tuesday: '#22c55e',
  cell:    '#f59e0b',
  overall: '#8b5cf6'
};

function KpiCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color?: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1 shadow-sm">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className={cn('text-3xl font-bold', color ?? 'text-foreground')}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function PctCard({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600';
  return <KpiCard label={label} value={`${value.toFixed(1)}%`} color={color} />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground/90">{children}</h3>
  );
}

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('3');
  const { data, isLoading, status } = useFetchAdminOverview(period);

  if (isLoading) {
    return (
      <Main>
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Church-wide attendance and performance insights</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-72 w-full mt-4" />
        <Skeleton className="h-72 w-full mt-4" />
      </Main>
    );
  }

  if (status === 'error' || !data) {
    return (
      <Main>
        <div className="flex h-60 items-center justify-center text-muted-foreground">
          <p className="text-sm">Could not load analytics data. The server may be starting up — try again shortly.</p>
        </div>
      </Main>
    );
  }

  const { counts, cellKpi, deptKpi, cellTrend, deptTrend, zonePerformance, deptPerformance } = data;

  const top5Zones    = zonePerformance.slice(0, 5);
  const bottom5Zones = [...zonePerformance].reverse().slice(0, 5).reverse();
  const top5Depts    = deptPerformance.slice(0, 5);
  const bottom5Depts = [...deptPerformance].reverse().slice(0, 5).reverse();

  const radarData = [
    { metric: 'Sun (Cell)',  value: cellKpi.sundayPct  },
    { metric: 'Tue (Cell)',  value: cellKpi.tuesdayPct },
    { metric: 'Cell Mtg',   value: cellKpi.cellPct     },
    { metric: 'Sun (Dept)', value: deptKpi.sundayPct   },
    { metric: 'Tue (Dept)', value: deptKpi.tuesdayPct  },
    { metric: 'Fri (Dept)', value: deptKpi.cellPct     }
  ];

  return (
    <Main>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Church-wide attendance and performance insights</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <Button key={p.value} size="sm" variant={period === p.value ? 'default' : 'outline'} onClick={() => setPeriod(p.value)}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Church counts ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Members" value={counts.members.toLocaleString()} />
        <KpiCard label="Cells"         value={counts.cells}  />
        <KpiCard label="Zones"         value={counts.zones}  />
        <KpiCard label="Departments"   value={counts.depts}  />
      </div>

      {/* ── Cell KPIs ─────────────────────────────────────────────────── */}
      <SectionTitle>Cell Attendance KPIs</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <PctCard label="Sunday Service"     value={cellKpi.sundayPct}  />
        <PctCard label="Tuesday Service"    value={cellKpi.tuesdayPct} />
        <PctCard label="Cell Meeting (Fri)" value={cellKpi.cellPct}    />
        <KpiCard label="Total Records" value={cellKpi.total.toLocaleString()} sub="Cell attendance records" />
      </div>

      {/* ── Dept KPIs ─────────────────────────────────────────────────── */}
      <SectionTitle>Department Attendance KPIs</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <PctCard label="Sunday Service"     value={deptKpi.sundayPct}  />
        <PctCard label="Tuesday Service"    value={deptKpi.tuesdayPct} />
        <PctCard label="Cell Meeting (Fri)" value={deptKpi.cellPct}    />
        <KpiCard label="Total Records" value={deptKpi.total.toLocaleString()} sub="Dept attendance records" />
      </div>

      {/* ── Performance radar ─────────────────────────────────────────── */}
      <SectionTitle>Performance Overview</SectionTitle>
      <div className="rounded-lg border bg-card p-4 shadow-sm h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <Radar name="%" dataKey="value" stroke={COLORS.overall} fill={COLORS.overall} fillOpacity={0.35} />
            <Tooltip formatter={(v: number) => `${v}%`} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Cell attendance trend ─────────────────────────────────────── */}
      {cellTrend.length > 0 && (
        <>
          <SectionTitle>Cell Attendance Trend — Attendance %</SectionTitle>
          <div className="rounded-lg border bg-card p-4 shadow-sm h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cellTrend} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                <defs>
                  <linearGradient id="gSun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.sunday} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.sunday} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.tuesday} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.tuesday} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.cell} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.cell} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend />
                <Area type="monotone" dataKey="sundayPct"  name="Sunday"  stroke={COLORS.sunday}  fill="url(#gSun)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="tuesdayPct" name="Tuesday" stroke={COLORS.tuesday} fill="url(#gTue)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="cellPct"    name="Cell Mtg" stroke={COLORS.cell}   fill="url(#gCell)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <SectionTitle>Cell Attendance Trend — Headcount</SectionTitle>
          <div className="rounded-lg border bg-card p-4 shadow-sm h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cellTrend} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sundayPresent"  name="Sunday"  fill={COLORS.sunday}  radius={[3,3,0,0]} />
                <Bar dataKey="tuesdayPresent" name="Tuesday" fill={COLORS.tuesday} radius={[3,3,0,0]} />
                <Bar dataKey="cellPresent"    name="Cell Mtg" fill={COLORS.cell}   radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── Dept attendance trend ─────────────────────────────────────── */}
      {deptTrend.length > 0 && (
        <>
          <SectionTitle>Department Attendance Trend — Attendance %</SectionTitle>
          <div className="rounded-lg border bg-card p-4 shadow-sm h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deptTrend} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                <defs>
                  <linearGradient id="dSun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.sunday} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.sunday} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dTue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.tuesday} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.tuesday} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dCell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.cell} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.cell} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend />
                <Area type="monotone" dataKey="sundayPct"  name="Sunday"       stroke={COLORS.sunday}  fill="url(#dSun)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="tuesdayPct" name="Tuesday"      stroke={COLORS.tuesday} fill="url(#dTue)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="cellPct"    name="Friday (Cell Mtg)" stroke={COLORS.cell}   fill="url(#dCell)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── Zone performance ─────────────────────────────────────────── */}
      <SectionTitle>Zone Performance — All Zones</SectionTitle>
      <div className="rounded-lg border bg-card p-4 shadow-sm h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={zonePerformance} layout="vertical" margin={{ top: 4, right: 40, bottom: 4, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="zone" tick={{ fontSize: 11 }} width={90} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Legend />
            <Bar dataKey="sundayPct"  name="Sunday"  fill={COLORS.sunday}  radius={[0,3,3,0]} />
            <Bar dataKey="tuesdayPct" name="Tuesday" fill={COLORS.tuesday} radius={[0,3,3,0]} />
            <Bar dataKey="cellPct"    name="Cell Mtg" fill={COLORS.cell}   radius={[0,3,3,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Top / Bottom zones ───────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-green-700">Top 5 Zones</h4>
          <div className="space-y-2">
            {top5Zones.map((z, i) => (
              <div key={z.zoneId} className="flex items-center justify-between rounded border px-3 py-2 bg-card text-sm">
                <span className="font-medium">#{i+1} {z.zone}</span>
                <span className={cn('font-bold', z.overallPct >= 75 ? 'text-green-600' : z.overallPct >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                  {z.overallPct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 text-red-700">Bottom 5 Zones (need attention)</h4>
          <div className="space-y-2">
            {bottom5Zones.map((z, i) => (
              <div key={z.zoneId} className="flex items-center justify-between rounded border px-3 py-2 bg-card text-sm">
                <span className="font-medium">{z.zone}</span>
                <span className={cn('font-bold', z.overallPct >= 75 ? 'text-green-600' : z.overallPct >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                  {z.overallPct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dept performance ─────────────────────────────────────────── */}
      <SectionTitle>Department Performance — All Departments</SectionTitle>
      <div className="rounded-lg border bg-card p-4 shadow-sm h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={deptPerformance} layout="vertical" margin={{ top: 4, right: 40, bottom: 4, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="dept" tick={{ fontSize: 10 }} width={130} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Legend />
            <Bar dataKey="sundayPct"  name="Sunday"       fill={COLORS.sunday}  radius={[0,3,3,0]} />
            <Bar dataKey="tuesdayPct" name="Tuesday"      fill={COLORS.tuesday} radius={[0,3,3,0]} />
            <Bar dataKey="cellPct"    name="Fri (Cell Mtg)" fill={COLORS.cell}  radius={[0,3,3,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Top / Bottom depts ───────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mt-6 mb-8">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-green-700">Top 5 Departments</h4>
          <div className="space-y-2">
            {top5Depts.map((d, i) => (
              <div key={d.deptId} className="flex items-center justify-between rounded border px-3 py-2 bg-card text-sm">
                <span className="font-medium">#{i+1} {d.dept}</span>
                <span className={cn('font-bold', d.overallPct >= 75 ? 'text-green-600' : d.overallPct >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                  {d.overallPct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 text-red-700">Bottom 5 Departments (need attention)</h4>
          <div className="space-y-2">
            {bottom5Depts.map((d) => (
              <div key={d.deptId} className="flex items-center justify-between rounded border px-3 py-2 bg-card text-sm">
                <span className="font-medium">{d.dept}</span>
                <span className={cn('font-bold', d.overallPct >= 75 ? 'text-green-600' : d.overallPct >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                  {d.overallPct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default observer(AdminAnalytics);
