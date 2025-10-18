'use client';
import { useEffect, useState } from 'react';
import { Main } from '@/components/layout/main';
import { observer } from 'mobx-react-lite';
import AttendanceTable from './components/AttendanceTable';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchAdminAttendance } from '@/hooks/attendance/useFetchAdminAttendance';
import TableToolbar from './components/TableToolbar';  // Import the TableToolbar

const ZoneAttendance = () => {
  const {
    // AuthStore: { userExtraInfo },
    AdminStore: { adminZoneAttendanceQuery }
  } = useStore();

  const [zonalAttendance, setAdminZonalAttendance] = useState<Array<TAdminAttendanceItem>>([]);
  // adminZoneAttendanceQuery.ZoneId = userExtraInfo.zonalId as string;
  const { data, isLoading } = useFetchAdminAttendance(adminZoneAttendanceQuery);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setAdminZonalAttendance(data);
    }
  }, [isLoading, data]);

  // Grouping zones by their name
  const groupedZones = zonalAttendance.reduce((acc, zone) => {
    const zoneKey = zone.name;
    if (!acc[zoneKey]) {
      acc[zoneKey] = [];
    }
    acc[zoneKey].push(zone);
    return acc;
  }, {} as Record<string, Array<TAdminAttendanceItem>>);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Zone Attendance</h2>
          <p className="text-muted-foreground">Here is the attendance for each zone!</p>
        </div>
      </div>

      <TableToolbar />

      {isLoading ? (
        <div className="flex w-full flex-col space-y-4">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-8 w-36" /> <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        Object.keys(groupedZones).map((zoneName) => {
          const zoneData = groupedZones[zoneName][0]; // Assuming the first zone entry holds the leader's details
          return (
            <div key={zoneData?.zoneId} className="mb-6">
              <div className="border-b pb-4 mb-4">
                <h3 className="font-bold text-xl">{zoneData?.name}</h3>
                <p className="text-muted-foreground">
                  Zonal Leader: {zoneData?.zonalLeader?.name}
                </p>
                <p className="text-muted-foreground">
                  Email: {zoneData?.zonalLeader?.email}
                </p>
                <p className="text-muted-foreground">
                  Phone: {zoneData?.zonalLeader?.phoneNumber}
                </p>
              </div>

              {/* Render one Attendance Table for all cellAttendances under the zone */}
              <div className="mb-4">
                <AttendanceTable zonalAttendance={zoneData?.cellAttendances || []} />
              </div>
            </div>
          );
        })
      )}
    </Main>
  );
};

export default observer(ZoneAttendance);
