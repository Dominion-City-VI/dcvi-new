import { useEffect, useState } from 'react';
import { Users, CalendarCheck, CalendarDays, Activity, Building2, MapPin } from 'lucide-react';
import { PeriodNameMap, periodText } from '@/constants/mangle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Overview from '../components/Overview';
import { useFetchAdminAnalytics } from '@/hooks/admin/useFetchAdminAnalytics';
import { StatCard } from '../components/StatCard';

function AdminDB() {
  const [query, setQuery] = useState('WEEK');
  const periodNum = PeriodNameMap.get(query) as number;

  const { data, isLoading } = useFetchAdminAnalytics({ period: periodNum });

  const [periodicAnalysis, setPeriodicAnalysis] = useState<Array<TPeriodicAnalysisDatapointItem>>(
    []
  );

  useEffect(() => {
    if (!isLoading && data?.periodicAnalysisDatapoint) {
      setPeriodicAnalysis(data.periodicAnalysisDatapoint || []);
    }
  }, [data, isLoading]);

  const perf = data?.performanceInPercentage;
  const totalMembers = perf?.cellStrength ?? 0;
  const sundayPct = perf?.sundayService ?? 0;
  const tuesdayPct = perf?.tuesdayAttendance ?? 0;
  const cellPct = perf?.cellAttendance ?? 0;

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
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
          title="Total Members"
          value={totalMembers}
          subtitle="Across all zones & cells"
          icon={Users}
          iconColor="text-primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Sunday Service"
          value={`${sundayPct.toFixed(1)}%`}
          subtitle="Avg. attendance rate this period"
          icon={CalendarDays}
          iconColor="text-yellow-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Tuesday Service"
          value={`${tuesdayPct.toFixed(1)}%`}
          subtitle="Avg. attendance rate this period"
          icon={CalendarCheck}
          iconColor="text-red-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Cell Meeting"
          value={`${cellPct.toFixed(1)}%`}
          subtitle="Cell attendance rate this period"
          icon={Activity}
          iconColor="text-blue-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Zones"
          value={data?.cellCount ?? '—'}
          subtitle="Active zones in the church"
          icon={MapPin}
          iconColor="text-green-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Departments"
          value={14}
          subtitle="Active departments"
          icon={Building2}
          iconColor="text-purple-500"
          isLoading={isLoading}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-[450px] w-full rounded-xl" />
      ) : (
        <Overview period={query} periodicAnalysis={periodicAnalysis} />
      )}
    </>
  );
}

export default AdminDB;
