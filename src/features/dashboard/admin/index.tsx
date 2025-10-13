import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const performanceArray: Array<{
  title: string;
  tag: keyof TPerformanceInPercentage;
  stat: number;
}> = [
  {
    title: 'Total Members',
    tag: 'cellStrength',
    stat: 0
  },
  {
    title: 'Tuesday Service',
    tag: 'tuesdayAttendance',
    stat: 0
  },
  {
    title: 'Sunday service',
    tag: 'sundayService',
    stat: 0
  },
  {
    title: 'Attendance',
    tag: 'cellAttendance',
    stat: 0
  }
];

function AdminDB() {
  const [query, setQuery] = useState('WEEK');
  const { data, isLoading } = useFetchAdminAnalytics({
    period: PeriodNameMap.get(query) as number
  });
  const [performance, setPerformance] = useState<TPerformanceInPercentage>({
    cellStrength: 0,
    sundayService: 0,
    cellAttendance: 0,
    tuesdayAttendance: 0
  });
  const [periodicAnalysis, setPeriodicAnalysis] = useState<Array<TPeriodicAnalysisDatapointItem>>(
    []
  );

  useEffect(() => {
    if (!isLoading && data?.performanceInPercentage) {
      setPerformance(data.performanceInPercentage);
      setPeriodicAnalysis(data.periodicAnalysisDatapoint || []);
    }
  }, [data, isLoading]);

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
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
        {isLoading
          ? performanceArray.map((item) => {
              return <Skeleton key={item.tag} className="h-[125px] rounded-xl" />;
            })
          : performanceArray.map((item) => {
              const value = performance?.[item.tag] ?? 0;
              return (
                <Card key={item.tag}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-muted-foreground text-xs">
                      ({value})% change
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {isLoading ? (
        <Skeleton className="h-[450px] w-full rounded-xl" />
      ) : (
        <Overview {...{ period: query, periodicAnalysis }} />
      )}
    </>
  );
}

export default AdminDB;