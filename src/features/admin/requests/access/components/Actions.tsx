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
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { observer } from 'mobx-react-lite';
import { EnumAccessRequest } from '@/constants/mangle';

interface DataTableRowActionsProps {
  row: Row<TAdminAccessReqsItem>;
}

function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const {
    AppConfigStore: { toggleModals }
  } = useStore();

  console.log("user access logs", row);

  // Update this function to open the UserAccessModal
  const handleAccessRequest = (requestStatus: number) => {
    toggleModals({
      open: true,
      name: AppModals.ADMIN_ACCESS_REQUEST_MODAL,
      requestId: row.original.id,
      zoneId: row.original.zoneId,
      cellId: row.original.cellId,
      roles:[],
      requestStatus: requestStatus // Pass requestStatus (approve/reject)
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0" disabled={!row.original.emailConfirmed}>
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem onClick={() => handleAccessRequest(EnumAccessRequest.APPROVE)} >
          Approve
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500"
          onClick={() => handleAccessRequest(EnumAccessRequest.REJECT)}
        >
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default observer(DataTableRowActions);
