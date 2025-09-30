import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import LongText from '@/components/LongText';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { sidebarData } from '@/components/layout/data/sidebar-data';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { gender, maritalStatus, statusMap } from '@/constants/data';
import { DataTableRowActions } from './Actions';

export const columns: Array<ColumnDef<TAdminUserItem>> = [
  {
    id: 'select',
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
    accessorKey: 'firstName',
    header: () => 'First Name',
    cell: ({ row }) => {
      return <small className="text-muted-foreground">{row.original.firstName}</small>;
    }
  },

  {
    accessorKey: 'lastName',
    header: () => 'Last Name',
    cell: ({ row }) => {
      return <small className="text-muted-foreground">{row.original.lastName}</small>;
    }
  },

  {
    accessorKey: 'phoneNumber',
    header: () => 'Phone Number',
    cell: ({ row }) => {
      return <small className="text-muted-foreground">{row.original.phoneNumber}</small>;
    }
  },

  {
    accessorKey: 'email',
    header: () => 'Email',
    cell: ({ row }) => {
      return <small className="text-muted-foreground">{row.original.email}</small>;
    }
  },

  {
    accessorKey: 'address',
    header: () => 'Address',
    cell: ({ row }) => {
      return (
        <div className="max-w-28">
          <LongText className="block overflow-hidden text-xs text-ellipsis whitespace-nowrap">
            <small className="text-muted-foreground">{row.original.address}</small>
          </LongText>
        </div>
      );
    }
  },

  {
    accessorKey: 'occupation',
    header: () => 'Occupation',
    cell: ({ row }) => {
      return <small className="text-muted-foreground">{row.original.occupation}</small>;
    }
  },

  {
    accessorKey: 'gender',
    header: () => 'Sex',
    cell: ({ row }) => {
      return (
        <small className="text-muted-foreground">
          {gender.filter((el) => row.original.gender === Number(el.value))[0].label}
        </small>
      );
    }
  },

  {
    accessorKey: 'maritalStatus',
    header: () => 'Marital status',
    cell: ({ row }) => {
      return (
        <small className="text-muted-foreground">
          {maritalStatus.filter((el) => row.original.maritalStatus === Number(el.value))[0].label}
        </small>
      );
    }
  },

  {
    accessorKey: 'trainings',
    header: () => 'Trngs.',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary" size="sm">
                <small className="text-muted-foreground">{row.original.trainings[0]}</small>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {row.original.trainings.map((el) => (
                <DropdownMenuItem key={el} className="gap-2 p-2">
                  <small className="text-muted-foreground">{el}</small>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  },

  {
    accessorKey: 'departments',
    header: () => 'Depts.',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary" size="sm">
                <small className="text-muted-foreground">{row.original.departments[0]}</small>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {row.original.departments.map((el) => (
                <DropdownMenuItem key={el} className="gap-2 p-2">
                  <small className="text-muted-foreground">{el}</small>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  },

  {
    accessorKey: 'roles',
    header: () => 'Roles',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary" size="sm">
                <small className="text-muted-foreground">
                  {
                    sidebarData.roleSwitcher.filter((role) =>
                      row.original.roles.includes(role.value)
                    )[0].name
                  }
                </small>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sidebarData.roleSwitcher
                .filter((role) => row.original.roles.includes(role.value))
                .map((role) => (
                  <DropdownMenuItem key={role.value} className="gap-2 p-2">
                    <small className="text-muted-foreground">{role.name}</small>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  },

  {
    accessorKey: 'status',
    header: () => 'Status',
    cell: ({ row }) => {
      return (
        <small className="text-muted-foreground">
          {statusMap[String(row.original.status)] ?? 'N/A'}
          {/* {userStatus.filter((el) => row.original.status === Number(el.value))[0].label} */}
        </small>
      );
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
