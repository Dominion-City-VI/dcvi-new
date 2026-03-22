import { useState } from 'react';
import { Users, CalendarCheck, CalendarDays, Activity } from 'lucide-react';
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
import { StatusPieChart } from '../components/StatusPieChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_COLORS = {
  present: '#22c55e',
  absent: '#ef4444',
  sick: '#f97316',
  traveled: '#3b82f6',
  ncm: '#a855f7'
};

function DepartmentDB() {
  const {
    AuthStore: { userExtraInfo }
  } = useStore();
  const [query, setQuery] = useState('WEEK');

  const periodNum = PeriodNameMap.get(query) as number;
  const { serviceSummary, statusSummary, isLoading } = useFetchDeptAnalytics({
    departmentId: userExtraInfo.departmentId,
    period: periodNum
  });

  const total = serviceSummary?.total ?? 0;
  const totalSunday = serviceSummary?.totalSunday ?? 0;
  const totalTuesday = serviceSummary?.totalTuesday ?? 0;
  const totalCell = serviceSummary?.totalCellAttendees ?? 0;
  const sundayPct = serviceSummary?.totalSundayPercentage ?? 0;
  const tuesdayPct = serviceSummary?.totalTuesdayPercentage ?? 0;
  const cellPct = serviceSummary?.totalCellAttendeesPercentage ?? 0;

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance Records"
          value={total}
          subtitle="Records filed this period"
          icon={Users}
          iconColor="text-primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Sunday Service"
          value={totalSunday}
          suffix={` (${sundayPct.toFixed(1)}%)`}
          subtitle="Attendance this period"
          icon={CalendarDays}
          iconColor="text-yellow-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Tuesday Service"
          value={totalTuesday}
          suffix={` (${tuesdayPct.toFixed(1)}%)`}
          subtitle="Attendance this period"
          icon={CalendarCheck}
          iconColor="text-red-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Cell Meeting"
          value={totalCell}
          suffix={` (${cellPct.toFixed(1)}%)`}
          subtitle="Cell attendance this period"
          icon={Activity}
          iconColor="text-blue-500"
          isLoading={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <StatusPieChart
            title="Attendance Status"
            description="Breakdown of member attendance statuses"
            data={pieData}
          />
          <Card>
            <CardHeader>
              <CardTitle>Service Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {[
                {
                  label: 'Sunday Service',
                  count: totalSunday,
                  pct: sundayPct,
                  color: 'bg-yellow-500'
                },
                {
                  label: 'Tuesday Service',
                  count: totalTuesday,
                  pct: tuesdayPct,
                  color: 'bg-red-500'
                },
                {
                  label: 'Cell Meeting',
                  count: totalCell,
                  pct: cellPct,
                  color: 'bg-blue-500'
                }
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div
                      className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default DepartmentDB;
