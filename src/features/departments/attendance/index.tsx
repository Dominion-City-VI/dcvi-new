'use client';
import { useEffect, useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import AttendanceTable from './components/DepartmentAttendanceTable';
import { useFetchAttendance } from '@/hooks/department/useFetchAttendance';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { TAttendanceFilterSchema } from './attendanceFilterSchema';

const EMPTY_FILTER: TAttendanceFilterSchema = {};

const Attendance = () => {
  const {
    AuthStore: { userExtraInfo, userRole }
  } = useStore();

  const [filter, setFilter] = useState<TAttendanceFilterSchema>(EMPTY_FILTER);
  const [cellAttendance, setCellAttendance] = useState<Array<TDeptAttendanceItem>>([]);

  const isFiltered = Object.values(filter).some(
    (v) => v !== undefined && v !== null && v !== ''
  );

  const { data, isLoading, status } = useFetchAttendance({
    UserRole: userRole[0],
    Identifier: userExtraInfo.departmentId,
    ...filter
  });

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setCellAttendance(data);
    }
  }, [isLoading, data]);

  const handleApply = (data: TAttendanceFilterSchema) => {
    setFilter(data);
  };

  const handleReset = () => {
    setFilter(EMPTY_FILTER);
  };

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">Here's your departmental attendance!</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex w-full flex-col space-y-4">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-8 w-36" /> <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : status === 'error' ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-sm">
            Could not load attendance data. The server may be starting up — please try again
            shortly.
          </p>
        </div>
      ) : (
        <AttendanceTable
          placeholder="Filter Members..."
          cellAttendance={cellAttendance}
          isFiltered={isFiltered}
          onApply={handleApply}
          onReset={handleReset}
        />
      )}
    </Main>
  );
};

export default observer(Attendance);
