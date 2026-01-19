import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from './Actions';
import { dateTimeUTC } from '@/utils/date';
import { DataTableColumnHeader } from './ColumnHeader';

export const columns: Array<ColumnDef<People>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected())
          // table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    accessorKey: 'firstName',
    header: () => 'First Name',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('firstName')}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'lastName',
    header: () => 'Last Name',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('lastName')}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('email') ?? '-'}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'phoneNumber',
    header: () => 'Phone Number',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('phoneNumber')}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'createdAt',
    header: () => 'Date Registered',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {dateTimeUTC(row.getValue('createdAt'))}
          </span>
        </div>
      );
    },
    enableColumnFilter: true
  },

  {
    accessorKey: 'doB',
    header: () => 'Date Of Birth',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {dateTimeUTC(row.getValue('doB')) ?? '-'}
          </span>
        </div>
      );
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'isLeader',
    header: () => 'Role',
    cell: ({ row }) => {
      const isLeader = row.original.isLeader;
      const isAssistant = row.original.isAssistant;
      
      let role = 'Member';
      
      if (isLeader) {
        role = 'Leader';
      } else if (isAssistant) {
        role = 'Assistant Leader';
      }
      
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {role}
          </span>
        </div>
      );
    },
    enableColumnFilter: true
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
