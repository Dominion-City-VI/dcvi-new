import { useNavigate } from '@tanstack/react-router';
import { ChevronsUpDown, Heart } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { sidebarData } from './data/sidebar-data';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { Badge } from '../ui/badge';

function SidebarTop() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const {
    AuthStore: { userRole, activeRole, updateActiveRole }
  } = useStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Heart className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Dominion City VI</span>
                <small>
                  {sidebarData.roleSwitcher.find((role) => activeRole === role.value)?.name}
                </small>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Roles</DropdownMenuLabel>
            {sidebarData.roleSwitcher
              .filter((role) => userRole.includes(role.value))
              .map((role, index) => (
                <DropdownMenuItem
                  key={role.value}
                  onClick={() =>
                    updateActiveRole(role.value, () => navigate({ to: '/', replace: true }))
                  }
                  className="gap-2 p-2"
                >
                  {role.name}
                  {activeRole === role.value && <Badge variant="default">Active</Badge>}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default observer(SidebarTop);
