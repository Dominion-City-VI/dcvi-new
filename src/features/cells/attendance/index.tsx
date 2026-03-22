'use client';
import { useEffect, useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import AttendanceTable from './components/AttendanceTable';
import { useFetchAttendance } from '@/hooks/attendance/useFetchAttendance';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { useCheckRestriction } from '@/hooks/admin/useRestrictions';
import { Lock } from 'lucide-react';

const Attendance = () => {
  const {
    AuthStore: { userExtraInfo, userRole },
    CellStore: { attendanceQuery }
  } = useStore();
  const cellId = userExtraInfo.cellId;
  const [cellAttendance, setCellAttendance] = useState<Array<TCellAttendanceItem>>([]);
  const { data, isLoading } = useFetchAttendance({
    UserRole: userRole[0],
    Identifier: cellId,
    ...attendanceQuery
  });

  const { data: restrictionData } = useCheckRestriction('cell', cellId);
  const isRestricted = restrictionData?.restricted ?? false;

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

      {isRestricted && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800">
          <Lock size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Attendance filing is currently restricted</p>
            <p className="text-xs mt-0.5">
              An admin has restricted your cell from submitting attendance records.
              {restrictionData?.data?.reason && ` Reason: "${restrictionData.data.reason}".`}
              {' '}You can still view past records, but cannot mark new attendance.
              Contact your zone leader or admin to have this lifted.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex w-full flex-col space-y-4">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-8 w-36" /> <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <AttendanceTable {...{ placeholder: 'Filter Members...', cellAttendance, isRestricted }} />
      )}
    </Main>
  );
};

export default observer(Attendance);
