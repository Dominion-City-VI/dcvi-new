import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { EnumAttendanceStatus } from '@/constants/mangle';

interface DataTableRowActionsProps {
  row: Row<TCellAttendanceItem>;
  weekDateRange: string;
  isRestricted?: boolean;
}

export function DataTableRowActions({ row, weekDateRange, isRestricted }: DataTableRowActionsProps) {
  const {
    AppConfigStore: { toggleModals }
  } = useStore();

  // const { memberId, cellAttenanceResponseVMs } = row.original;
  const { cellAttenanceResponseVMs } = row.original;

  // pick the right week's data
  const weekData = cellAttenanceResponseVMs.find((w) => w.dateRange === weekDateRange);

  if (!weekData) return null; // nothing to manage
  if (isRestricted) return null; // filing disabled by admin

  const { tuesdayDate, cellDate, sundayDate, record } = weekData;
  const { cellAttendanceStatus, sundayAttendanceStatus, tuesdayAttendanceStatus } = record;

  const isAttendaceUpdate =
    cellAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
    sundayAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
    tuesdayAttendanceStatus !== EnumAttendanceStatus.UNMARKED;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem
          onClick={() =>
            toggleModals({
              open: true,
              name: AppModals.MARK_ATTENDANCE_MODAL,
              // id: memberId,
              //id: row.original.cellId,
              id: row.original.memberId,
              isAttendaceUpdate,
              tuesdayServiceDate: tuesdayDate,
              cellMeetingDate: cellDate,
              sundayServiceDate: sundayDate
            })
          }
        >
          Manage attendance
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
