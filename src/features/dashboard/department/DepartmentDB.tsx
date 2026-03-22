import { useState } from 'react';
import { Users, CalendarCheck, CalendarDays, Lock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PeriodNameMap, periodText } from '@/constants/mangle';
import { useStore } from '@/store';
import { useFetchDeptAnalytics } from '@/hooks/department/useFetchDeptAnalytics';
import { StatCard } from '../components/StatCard';
import { AttendanceServiceCard } from '../components/AttendanceServiceCard';
import { useCheckRestriction } from '@/hooks/admin/useRestrictions';

function DepartmentDB() {
  const {
    AuthStore: { userExtraInfo }
  } = useStore();
  const [query, setQuery] = useState('WEEK');

  const periodNum = PeriodNameMap.get(query) as number;
  const departmentId = userExtraInfo.departmentId;

  const { data: restrictionData } = useCheckRestriction('dept', departmentId);
  const isRestricted = restrictionData?.restricted ?? false;

  const { serviceSummary, isLoading } = useFetchDeptAnalytics({
    departmentId,
    period: periodNum
  });

  const total = serviceSummary?.total ?? 0;
  const totalSunday = serviceSummary?.totalSunday ?? 0;
  const totalTuesday = serviceSummary?.totalTuesday ?? 0;
  const sundayPct = serviceSummary?.totalSundayPercentage ?? 0;
  const tuesdayPct = serviceSummary?.totalTuesdayPercentage ?? 0;

  const serviceRates = [
    { label: 'Sunday Service',  pct: sundayPct,  present: totalSunday,  total, color: 'bg-yellow-500' },
    { label: 'Tuesday Service', pct: tuesdayPct, present: totalTuesday, total, color: 'bg-red-500'    }
  ];

  return (
    <>
      {isRestricted && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800">
          <Lock size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Attendance filing restricted</p>
            <p className="text-xs mt-0.5">
              An admin has restricted your department from submitting attendance records.
              {restrictionData?.data?.reason && ` Reason: "${restrictionData.data.reason}"`}
              {' '}Please contact your admin for more information.
            </p>
          </div>
        </div>
      )}
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Department Dashboard</h1>
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

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Records"
          value={total}
          subtitle="Attendance records this period"
          icon={Users}
          iconColor="text-primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Sunday Present"
          value={totalSunday}
          suffix={` (${sundayPct.toFixed(1)}%)`}
          subtitle="Members present on Sundays"
          icon={CalendarDays}
          iconColor="text-yellow-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Tuesday Present"
          value={totalTuesday}
          suffix={` (${tuesdayPct.toFixed(1)}%)`}
          subtitle="Members present on Tuesdays"
          icon={CalendarCheck}
          iconColor="text-red-500"
          isLoading={isLoading}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-[220px] rounded-xl" />
      ) : (
        <AttendanceServiceCard
          title="Service Attendance"
          description="Present members out of total records filed this period"
          services={serviceRates}
        />
      )}
    </>
  );
}

export default DepartmentDB;
