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

interface DataTableRowActionsProps {
  row: Row<TAdminUserItem>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
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
        <DropdownMenuItem
          onClick={() =>
            toggleModals({
              name: AppModals.UPDATE_ROLE_MODAL,
              open: true,
              fullName: `${row.original.firstName} ${row.original.lastName}`,
              emailAddress: row.original.email,
              id: row.original.userId,
              roles: row.original.roles,
              zoneId: row.original.zoneId,
              cellId: row.original.cellId
            })
          }
        >
          Update role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              toggleModals({
                name: AppModals.REVOKE_ROLE_MODAL,
                open: true,
                fullName: `${row.original.firstName} ${row.original.lastName}`,
                emailAddress: row.original.email,
                id: row.original.userId,
                roles: row.original.roles
              })
            }
          >
          Revoke access
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
