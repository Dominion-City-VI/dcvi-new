import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ZoneItemSchema } from './data/schema';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { Link } from '@tanstack/react-router';
import { Route as AdminRoute } from '@/routes/_authenticated/admin/zones/$zoneId/$cellId';
import { Route as ZonalPastorRoute } from '@/routes/_authenticated/zone/cells/$cellId';
import { useMemo } from 'react';
import { EnumRoles } from '@/constants/mangle';
import { Route as ZonalCellAttendanceId } from '@/routes/_authenticated/cell/attendance/$cellAttendanceCellId';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const data = ZoneItemSchema.parse(row.original);
  const {
    AuthStore: { activeRole },
    AppConfigStore: { toggleModals }
  } = useStore();

  const to = useMemo(() => {
    return activeRole !== EnumRoles.SUPER_ADMIN
      ? ZonalPastorRoute.fullPath.toString().replace('$cellId', data.cellId)
      : AdminRoute.fullPath.toString().replace('$cellId', data.cellId);
  }, [activeRole]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem>
          <Link to={to}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to={ZonalCellAttendanceId.fullPath.replace('$cellAttendanceCellId', data.cellId)}>Attendance</Link>
          </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            toggleModals({ open: true, name: AppModals.DELETE_CELL_MODAL, resourceId: data.cellId })
          }
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
