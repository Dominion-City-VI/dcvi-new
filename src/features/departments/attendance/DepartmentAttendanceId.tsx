'use client';
import { useEffect, useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import AttendanceTable from './components/DepartmentAttendanceTable';
import { useFetchAttendance } from '@/hooks/department/useFetchAttendance';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
// Import from the correct route path that matches your file structure
import { Route } from '@/routes/_authenticated/department/deptAttendance/$departmentAttendanceId';

const DepartmentAttendanceId = () => {
  const { departmentAttendanceId,  } = Route.useParams();

  const {
    AuthStore: { userExtraInfo },
    DepartmentStore: { attendanceQuery }
  } = useStore();

  
  const [cellAttendance, setCellAttendance] = useState<Array<TDeptAttendanceItem>>([]);
  const { data, isLoading } = useFetchAttendance({
    Identifier: departmentAttendanceId ?? userExtraInfo.departmentId,
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
      ) : (
        <AttendanceTable {...{ placeholder: 'Filter Members...', cellAttendance }} />
      )}
    </Main>
  );
};

export default observer(DepartmentAttendanceId);