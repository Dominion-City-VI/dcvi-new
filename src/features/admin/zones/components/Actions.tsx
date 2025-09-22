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
import { Link } from '@tanstack/react-router';
import { Route} from '@/routes/_authenticated/admin/zones/$zoneId';

interface DataTableRowActionsProps {
  row: Row<TAllZoneItem>;
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
        <DropdownMenuItem>
          <Link to={Route.fullPath.replace('$zoneId', row.original.id)}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            toggleModals({
              open: true,
              name: AppModals.DELETE_ZONE_MODAL,
              resourceId: row.original.id
            })
          }
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
