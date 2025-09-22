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
import { EnumActionRequestType } from '@/constants/mangle';

interface DataTableRowActionsProps {
  row: Row<TAdminActionReqsItem>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { requestType, requesterComments, subActionId, actionId, requestStatus, id } = row.original;
  const {
    AppConfigStore: { toggleModals }
  } = useStore();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        {requestType === EnumActionRequestType.CELL_MERGE && (
          <DropdownMenuItem
            onClick={() =>
              toggleModals({
                open: true,
                name: AppModals.MERGE_REQUEST_MODAL,
                requestType,
                requestorComments: requesterComments,
                unmapFromId: actionId,
                mapToId: subActionId ?? ''
              })
            }
          >
            Merge cells
          </DropdownMenuItem>
        )}
        {requestType === EnumActionRequestType.ZONAL_MERGE && (
          <DropdownMenuItem
            onClick={() =>
              toggleModals({
                open: true,
                name: AppModals.MERGE_REQUEST_MODAL,
                requestType,
                requestorComments: requesterComments,
                unmapFromId: actionId,
                mapToId: subActionId ?? ''
              })
            }
          >
            Merge zones
          </DropdownMenuItem>
        )}
        {requestType === EnumActionRequestType.DELETE_CELL && (
          <DropdownMenuItem variant="default" onClick={() => {}}>
            Delete cell
          </DropdownMenuItem>
        )}
        {requestType === EnumActionRequestType.DELETE_ZONE && (
          <DropdownMenuItem variant="default" onClick={() => {}}>
            Delete zone
          </DropdownMenuItem>
        )}
        {requestType === EnumActionRequestType.MEMBER_DELETE && (
          <DropdownMenuItem  onClick={() => 
              toggleModals({
              open: true,
                name: AppModals.ACTION_REQUEST_MODAL,
                id: id,
                requestType,
                requestorComments: requesterComments,
                requestStatus
              })
            }>
          {requestStatus === 1 ? 'Review Request' : requestStatus === 2 ? 'Reject Request' : 'Approve Request'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
