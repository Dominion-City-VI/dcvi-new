'use client';
import { useEffect, useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import AttendanceTable from './components/AttendanceTable';
import { useFetchAttendance } from '@/hooks/attendance/useFetchAttendance';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';

const Attendance = () => {
  const {
    AuthStore: { userExtraInfo, userRole },
    CellStore: { attendanceQuery }
  } = useStore();
  const [cellAttendance, setCellAttendance] = useState<Array<TCellAttendanceItem>>([]);
  const { data, isLoading } = useFetchAttendance({
    UserRole: userRole[0],
    Identifier: userExtraInfo.cellId,
    ...attendanceQuery
  });

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setCellAttendance(data);
    }
  }, [isLoading, data]);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cell Attendance</h2>
          <p className="text-muted-foreground">Here's your Cell members attendance!</p>
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
        <AttendanceTable {...{ placeholder: 'Filter Members...', cellAttendance }} />
      )}
    </Main>
  );
};

export default observer(Attendance);
