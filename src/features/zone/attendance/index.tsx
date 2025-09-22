'use client';
import { useEffect, useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import AttendanceTable from './components/AttendanceTable';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchZonalttendance } from '@/hooks/attendance/useFetchZonalAttendance';

const ZoneAttendance = () => {
  const {
    AuthStore: { userExtraInfo },
    ZoneStore: { zoneAttendanceQuery }
  } = useStore();
  const [zonalAttendance, setZonalAttendance] = useState<Array<TZonalAttendanceItem>>([]);
  const { data, isLoading } = useFetchZonalttendance(
    userExtraInfo.zonalId as string,
    zoneAttendanceQuery
  );

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setZonalAttendance(data);
    }
  }, [isLoading, data]);

  console.log(zonalAttendance);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Zone Attendance</h2>
          <p className="text-muted-foreground">Here's your Zone attendance!</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex w-full flex-col space-y-4">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-8 w-36" /> <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <AttendanceTable {...{ zonalAttendance }} />
      )}
    </Main>
  );
};

export default observer(ZoneAttendance);
