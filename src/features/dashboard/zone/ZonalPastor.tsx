import { useEffect, useState } from 'react';
import { Users, CalendarCheck, CalendarDays, Activity, Layers } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PeriodNameMap, periodText } from '@/constants/mangle';
import { useFetchZoneAnalytics } from '@/hooks/zone/useFetchZoneAnalytics';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import Overview from '../components/Overview';
import { StatCard } from '../components/StatCard';
import { AttendanceServiceCard } from '../components/AttendanceServiceCard';

function ZonalPastorDB() {
  const {
    AuthStore: { userExtraInfo }
  } = useStore();
  const [query, setQuery] = useState('WEEK');
  const periodNum = PeriodNameMap.get(query) as number;

  const { data, isLoading } = useFetchZoneAnalytics({
    id: userExtraInfo.zonalId as string,
    period: periodNum
  });

  const [periodicAnalysis, setPeriodicAnalysis] = useState<Array<TPeriodicAnalysisDatapointItem>>(
    []
  );

  useEffect(() => {
    if (!isLoading && data?.performanceInPercentage) {
      setPeriodicAnalysis(data.periodicAnalysisDatapoint || []);
    }
  }, [data, isLoading]);

  const perf = data?.performanceInPercentage;
  const totalMembers = perf?.cellStrength ?? 0;
  const sundayPct = perf?.sundayService ?? 0;
  const tuesdayPct = perf?.tuesdayAttendance ?? 0;
  const cellPct = perf?.cellAttendance ?? 0;
  const cellCount = data?.cellCount ?? 0;

  const serviceRates = [
    { label: 'Sunday Service',  pct: sundayPct,  color: 'bg-yellow-500' },
    { label: 'Tuesday Service', pct: tuesdayPct, color: 'bg-red-500'    },
    { label: 'Cell Meeting',    pct: cellPct,    color: 'bg-blue-500'   }
  ];

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Zone Dashboard</h1>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Zone Members"
          value={totalMembers}
          subtitle="Across all cells in your zone"
          icon={Users}
          iconColor="text-primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Cells in Zone"
          value={cellCount}
          subtitle="Active cells under your zone"
          icon={Layers}
          iconColor="text-green-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Sunday Service"
          value={`${sundayPct.toFixed(1)}%`}
          subtitle="Zone avg. this period"
          icon={CalendarDays}
          iconColor="text-yellow-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Tuesday Service"
          value={`${tuesdayPct.toFixed(1)}%`}
          subtitle="Zone avg. this period"
          icon={CalendarCheck}
          iconColor="text-red-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Cell Meeting"
          value={`${cellPct.toFixed(1)}%`}
          subtitle="Zone cell attendance avg."
          icon={Activity}
          iconColor="text-blue-500"
          isLoading={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="col-span-2 h-[450px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2">
            <Overview period={query} periodicAnalysis={periodicAnalysis} />
          </div>
          <AttendanceServiceCard
            title="Attendance Rate"
            description="Present members this period"
            services={serviceRates}
          />
        </div>
      )}
    </>
  );
}

export default ZonalPastorDB;
