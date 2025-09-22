import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from './Actions';
import LongText from '@/components/LongText';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { actionRequestStatus, actionRequestTypes } from './data/data';
import { getActionReqStatusText, getActionReqTypeText } from '@/utils/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export const columns: Array<ColumnDef<TAdminActionReqsItem>> = [
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
    accessorKey: 'requestType',
    header: () => 'Request Type',
    cell: ({ getValue }) => {
      const type = getValue<number>();
      const badgeColor = actionRequestTypes.get(type);
      return (
        <div className="">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {getActionReqTypeText(type)}
          </Badge>
        </div>
      );
    }
  },

  {
    accessorKey: 'requestStatus',
    header: () => 'Request Status',
    cell: ({ getValue }) => {
      const status = getValue<number>();
      const badgeColor = actionRequestStatus.get(status);
      return (
        <div className="">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {getActionReqStatusText(status)}
          </Badge>
        </div>
      );
    }
  },

  {
    accessorKey: 'requesterUserInfo',
    header: () => '(Requested By) Info',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="text-muted-foreground">
            {row.original.requesterUserInfo.firstName} {row.original.requesterUserInfo.lastName}
          </div>
          <small className="text-muted-foreground">{row.original.requesterUserInfo.email}</small>
        </div>
      );
    }
  },

  {
    accessorKey: 'requesterComments',
    header: () => 'Requester comments',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {row.original?.requesterComments ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary" size="sm">
                  <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                    <small className="">{row.original?.requesterComments[0]}</small>
                  </LongText>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {row.original.requesterComments.map((el) => (
                  <DropdownMenuItem key={el} className="gap-2 p-2">
                    <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                      <small className="">{el}</small>
                    </LongText>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            '-'
          )}
        </div>
      );
    }
  },

  {
    accessorKey: 'approverUserInfo',
    header: () => '(Approved By) Info',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.original.approverUserInfo?.firstName ? (
            <>
              <small className="text-muted-foreground">
                {row.original.approverUserInfo.firstName} {row.original.requesterUserInfo.lastName}
              </small>
              <small className="text-muted-foreground">{row.original.approverUserInfo.email}</small>
            </>
          ) : (
            '-'
          )}
        </div>
      );
    }
  },

  {
    accessorKey: 'adminComments',
    header: () => 'Admin comments',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {row.original?.adminComments ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary" size="sm">
                  <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                    <small className="">{row.original?.adminComments[0]}</small>
                  </LongText>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {row.original.adminComments.map((el) => (
                  <DropdownMenuItem key={el} className="gap-2 p-2">
                    <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                      <small className="">{el}</small>
                    </LongText>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            '-'
          )}
        </div>
      );
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
