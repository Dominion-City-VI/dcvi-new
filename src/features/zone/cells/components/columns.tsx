import { ColumnDef } from '@tanstack/react-table';
import LongText from '@/components/LongText';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from './Actions';

export const columns: Array<ColumnDef<TCell>> = [
  {
    id: 'cellId',
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
    accessorKey: 'cellName',
    header: () => 'Cell name',
    cell: ({ row }) => {
      return <LongText className="line-clamp-3 text-ellipsis">{row.original.cellName}</LongText>;
    }
  },

  {
    accessorKey: 'cellLeaderName',
    header: () => 'Leader Name',
    cell: ({ row }) => {
      return <div>{row.original?.cellLeaderName ?? '-'}</div>;
    }
  },

  {
    accessorKey: 'cellLeaderEmail',
    header: () => 'Leader email',
    cell: ({ row }) => {
      return <div>{row.original?.cellLeaderEmail ?? '-'}</div>;
    }
  },

  {
    accessorKey: 'cellLeaderPhoneNumber',
    header: () => 'Leader email',
    cell: ({ row }) => {
      return <div>(+234) {row.original?.cellLeaderPhoneNumber ?? '-'}</div>;
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
