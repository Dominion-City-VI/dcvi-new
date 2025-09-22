import { ColumnDef } from '@tanstack/react-table';
import LongText from '@/components/LongText';
import { getZoneStatusText } from '@/utils/zones';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from './Actions';
import { zoneStatusCallTypes } from './data/data';

export const columns: Array<ColumnDef<TAllZoneItem>> = [
  {
    id: 'id',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },

  {
    accessorKey: 'name',
    header: () => 'Zone name',
    cell: ({ row }) => {
      return <LongText className="line-clamp-3 text-ellipsis">{row.original.name}</LongText>;
    }
  },

  {
    accessorKey: 'zonalLeader',
    header: () => 'Zonal Leader',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <small>{row.original?.zonalLeader?.name ?? '-'}</small>
          <small>{row.original?.zonalLeader?.email ?? '-'}</small>
          <small>(+234) {row.original?.zonalLeader?.phoneNumber ?? '-'}</small>
        </div>
      );
    }
  },

  {
    accessorKey: 'zoneStatus',
    header: () => 'Status',
    cell: ({ row }) => {
      const badgeColor = zoneStatusCallTypes.get(row.original.zoneStatus);
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {getZoneStatusText(row.original.zoneStatus)}
        </Badge>
      );
    }
  },

  {
    accessorKey: 'cellCount',
    header: () => 'Cell count',
    cell: ({ row }) => {
      return <div>{row.original?.cellCount ?? '-'}</div>;
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
