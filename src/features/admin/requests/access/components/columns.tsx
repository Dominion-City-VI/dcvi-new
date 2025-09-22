import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import LongText from '@/components/LongText';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { gender, maritalStatus } from '@/constants/data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import DataTableRowActions from './Actions';

export const columns: Array<ColumnDef<TAdminAccessReqsItem>> = [
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
    accessorKey: 'emailAddress',
    header: () => 'Email',
    cell: ({ row }) => {
      return (
        <div className="max-w-28">
          <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
            <small>{row.original.emailAddress}</small>
          </LongText>
        </div>
      );
    }
  },

  {
    accessorKey: 'emailConfirmed',
    header: () => 'Email',
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.emailConfirmed ? 'default' : 'secondary'}>
          <small className="">{row.original.emailConfirmed ? 'Verified' : 'Unverified'}</small>
        </Badge>
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
    accessorKey: 'isConsideredLeader',
    header: () => 'Role',
    cell: ({ row }) => {
      return (
        <small className="text-muted-foreground">
          {row.original.isConsideredLeader && 'Cell Leader'}
          {row.original.isAssistantCellLeader && 'Asst. Cell Leader'}
          {!row.original.isAssistantCellLeader && !row.original.isAssistantCellLeader && 'Member'}
        </small>
      );
    }
  },

  {
    accessorKey: 'trainings',
    header: () => 'Tranings.',
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
    accessorKey: 'createdAt',
    header: () => 'Date created',
    cell: ({ row }) => {
      return (
        <small className="text-muted-foreground">
          {format(new Date(row.original.createdAt), 'dd MMM yyyy')}
        </small>
      );
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
