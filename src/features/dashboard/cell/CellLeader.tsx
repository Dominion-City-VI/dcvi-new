import { useEffect, useState } from 'react';
import { Users, CalendarCheck, CalendarDays, Activity } from 'lucide-react';
import { PeriodNameMap, periodText, EnumRoles } from '@/constants/mangle';
import { useFetchCellAnalytics } from '@/hooks/cell/useFetchCellAnalytics';
import { useStore } from '@/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Overview from '../components/Overview';
import { useFetchAttendanceSummaries } from '@/hooks/attendance/useFetchCellStatusSummary';
import { StatCard } from '../components/StatCard';
import { StatusPieChart } from '../components/StatusPieChart';

const STATUS_COLORS = {
  present: '#22c55e',
  absent: '#ef4444',
  sick: '#f97316',
  traveled: '#3b82f6',
  ncm: '#a855f7'
};

function CellLeaderDB() {
  const {
    AuthStore: { userExtraInfo, activeRole }
  } = useStore();
  const [query, setQuery] = useState('WEEK');
  const [periodicAnalysis, setPeriodicAnalysis] = useState<Array<TPeriodicAnalysisDatapointItem>>([]);

  const periodNum = PeriodNameMap.get(query) as number;
  const cellId = userExtraInfo.cellId;

  const { data, isLoading } = useFetchCellAnalytics(
    { period: periodNum },
    cellId
  );

  const { statusSummary, isLoading: summaryLoading } = useFetchAttendanceSummaries({
    id: cellId,
    period: periodNum,
    roleType: EnumRoles.CELL_LEADER
  });

  useEffect(() => {
    if (!isLoading && data?.performanceInPercentage) {
      setPeriodicAnalysis(data.periodicAnalysisDatapoint || []);
    }
  }, [data, isLoading]);

  // Show skeleton while waiting for cellId to be resolved after role switch
  if (!cellId) {
    return (
      <div className="flex flex-col gap-4">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="col-span-2 h-[450px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Loading cell information for role {activeRole}…
        </p>
      </div>
    );
  }

  const perf = data?.performanceInPercentage;
  const totalMembers = perf?.cellStrength ?? 0;
  const sundayPct = perf?.sundayService ?? 0;
  const tuesdayPct = perf?.tuesdayAttendance ?? 0;
  const cellPct = perf?.cellAttendance ?? 0;

  const pieData = [
    { name: 'Present', value: statusSummary?.totalPresent ?? 0, color: STATUS_COLORS.present },
    { name: 'Absent', value: statusSummary?.totalAbsent ?? 0, color: STATUS_COLORS.absent },
    { name: 'Sick', value: statusSummary?.totalSick ?? 0, color: STATUS_COLORS.sick },
    { name: 'Traveled', value: statusSummary?.totalTravel ?? 0, color: STATUS_COLORS.traveled },
    { name: 'Non-Church', value: statusSummary?.totalNCM ?? 0, color: STATUS_COLORS.ncm }
  ];

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Cell Dashboard</h1>
        <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
          <Select value={query} onValueChange={setQuery}>
            <SelectTrigger className="w-36">
              <SelectValue>{periodText.get(query)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEK">{periodText.get('WEEK')}</SelectItem>
              <SelectItem value="MONTH">{periodText.get('MONTH')}</SelectItem>
              <SelectItem value="YEAR">{periodText.get('YEAR')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Cell Members"
          value={totalMembers}
          subtitle="Total in your cell"
          icon={Users}
          iconColor="text-primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Sunday Service"
          value={`${sundayPct.toFixed(1)}%`}
          subtitle="Attendance this period"
          icon={CalendarDays}
          iconColor="text-yellow-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Tuesday Service"
          value={`${tuesdayPct.toFixed(1)}%`}
          subtitle="Attendance this period"
          icon={CalendarCheck}
          iconColor="text-red-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Cell Meeting"
          value={`${cellPct.toFixed(1)}%`}
          subtitle="Cell attendance this period"
          icon={Activity}
          iconColor="text-blue-500"
          isLoading={isLoading}
        />
      </div>

      {isLoading || summaryLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="col-span-2 h-[450px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2">
            <Overview period={query} periodicAnalysis={periodicAnalysis} />
          </div>
          <StatusPieChart
            title="Member Status"
            description="Attendance breakdown this period"
            data={pieData}
          />
        </div>
      )}
    </>
  );
}

export default CellLeaderDB;
