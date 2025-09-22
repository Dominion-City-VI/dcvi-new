import { LinkProps } from '@tanstack/react-router';

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  rba: Array<number>;
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'];
  rba: Array<number>;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;
type RoleSwitcher = {
  name: string;
  value: number;
};

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarData {
  roleSwitcher: Array<RoleSwitcher>;
  navGroups: Array<NavGroup>;
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
