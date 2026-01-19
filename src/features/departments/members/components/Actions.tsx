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
  row: Row<People>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const {
    AuthStore: { userExtraInfo },
    AppConfigStore: { toggleModals }
  } = useStore();

  const member = row.original;
  const memberId = member.userId;

  const handleViewEditMember = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!memberId) {
      return;
    }
     console.error('Member ID is missing:', row.original.userId);
    toggleModals({
      open: true,
      name: AppModals.DEPARTMENT_VIEW_MEMBER_MODAL,
      id: row.original.userId
    });
  };

  const handleDeleteMember = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!memberId) {
      console.error('Member ID is missing:', member);
      return;
    }
    
    toggleModals({
      open: true,
      name: AppModals.DEPARTMENT_DELETE_MEMBER_MODAL,
      userId: row.original.userId,
      departmentId: userExtraInfo.departmentId
    });
  };

  // If no valid ID, don't render the menu
  if (!memberId) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem 
          onClick={handleViewEditMember}
          className="cursor-pointer"
        >
          View/Edit details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDeleteMember}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          Delete member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}