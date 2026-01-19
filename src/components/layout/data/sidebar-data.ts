import { IconLayoutDashboard, IconTool, IconUserCog } from '@tabler/icons-react';
import { type SidebarData } from '../types';
import { EnumRoles } from '@/constants/mangle';
import {
  GitPullRequestArrow,
  MessageSquare,
  SettingsIcon,
  TableCellsMerge,
  Users,
  Wallet2
} from 'lucide-react';
import { Route } from '@/routes/_authenticated/index';
import { Route as phoneBookRoute } from '@/routes/_authenticated/messaging/phone-book';
import { Route as sendMessageRoute } from '@/routes/_authenticated/messaging/sms';
import { Route as walletRoute } from '@/routes/_authenticated/wallet';
import { Route as usersRoute } from '@/routes/_authenticated/admin/users';
import { Route as accessRequestRoute } from '@/routes/_authenticated/admin/requests/access';
import { Route as actionRequestRoute } from '@/routes/_authenticated/admin/requests/actions';
import { Route as adminZonesRoute } from '@/routes/_authenticated/admin/zones';
import { Route as adminZonesAttendaceRoute } from '@/routes/_authenticated/admin/zones/attendance';
import { Route as departmentAttendaceRoute } from '@/routes/_authenticated/department/deptAttendance';
import { Route as departmentMembersRoute } from '@/routes/_authenticated/department/departmentMembers';
import { Route as AdmindepartmentAndMembersRoute } from '@/routes/_authenticated/admin/departments';

export const sidebarData: SidebarData = {
  roleSwitcher: [
    {
      name: 'Admin',
      value: EnumRoles.SUPER_ADMIN
    },
    {
      name: 'Sub Admin',
      value: EnumRoles.SUB_ADMIN
    },
    {
      name: 'Senior Pastor',
      value: EnumRoles.SENIOR_PASTOR
    },
    {
      name: 'Pastor',
      value: EnumRoles.PASTOR
    },
    {
      name: 'District Pastor',
      value: EnumRoles.DISTRICT_PASTOR
    },
    {
      name: 'Zonal Pastor',
      value: EnumRoles.ZONAL_PASTOR
    },
    {
      name: 'Cell Leader',
      value: EnumRoles.CELL_LEADER
    },
    {
      name: 'Asst. cell leader',
      value: EnumRoles.ASST_CELL_LEADER
    },
    {
      name: 'Member',
      value: EnumRoles.MEMBER
    },
    {
      name: 'Departmental Head',
      value: EnumRoles.DEPARTMENTAL_HEAD
    },
    {
      name: 'Asst. dept. head',
      value: EnumRoles.ASST_DEPARTMENTAL_HEAD
    }
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: Route.fullPath,
          icon: IconLayoutDashboard,
          rba: []
        },
        {
          title: 'Messaging',
          icon: MessageSquare,
          rba: [],
          items: [
            { title: 'sms', url: sendMessageRoute.fullPath, rba: [] },
            { title: 'Phone book', url: phoneBookRoute.fullPath, rba: [] }
          ]
        },
        {
          title: 'Wallet',
          url: walletRoute.fullPath,
          icon: Wallet2,
          rba: []
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Manage cell',
          icon: TableCellsMerge,
          rba: [EnumRoles.CELL_LEADER, EnumRoles.ASST_CELL_LEADER],
          items: [
            {
              title: 'Members',
              url: '/cell/members',
              rba: []
            },
            {
              title: 'Attendance',
              url: '/cell/attendance',
              rba: []
            }
          ]
        },
        {
          title: 'Manage Zone',
          icon: TableCellsMerge,
          rba: [EnumRoles.ZONAL_PASTOR],
          items: [
            {
              title: 'Zone',
              url: '/zone/cells',
              rba: []
            },
            {
              title: 'Attendance',
              url: '/zone/attendance',
              rba: []
            }
          ]
        },
        {
          title: 'Users',
          icon: Users,
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN],
          url: usersRoute.fullPath
        },
        {
          title: 'Requests',
          icon: GitPullRequestArrow,
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN],
          items: [
            {
              title: 'Access',
              url: accessRequestRoute.fullPath,
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN]
            },
            {
              title: 'Actions',
              url: actionRequestRoute.fullPath,
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN]
            }
          ]
        },

        {
          title: 'Manage Zone',
          icon: TableCellsMerge,
          rba: [EnumRoles.SUPER_ADMIN,EnumRoles.SUB_ADMIN,EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR],
          items: [
            {
              title: 'Zone',
              url: adminZonesRoute.fullPath,
              rba: [EnumRoles.SUPER_ADMIN,EnumRoles.SUB_ADMIN,EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
            },
            {
              title: 'Attendance',
              url: adminZonesAttendaceRoute.fullPath,//zone/attendance
              rba: [EnumRoles.SUPER_ADMIN,EnumRoles.SUB_ADMIN,EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
            }
          ]
        },
        {
          title: 'Manage Department',
          icon: TableCellsMerge,
          rba: [EnumRoles.DEPARTMENTAL_HEAD, EnumRoles.ASST_DEPARTMENTAL_HEAD],
          items: [
            {
              title: 'Department',
              url: departmentMembersRoute.fullPath,
              rba: [EnumRoles.DEPARTMENTAL_HEAD, EnumRoles.ASST_DEPARTMENTAL_HEAD]
            },
            {
              title: 'Attendance',
              url: departmentAttendaceRoute.fullPath,
              rba: [EnumRoles.DEPARTMENTAL_HEAD, EnumRoles.ASST_DEPARTMENTAL_HEAD]
            }
          ]
        },

        {
          title: 'Manage Department',
          icon: TableCellsMerge,
          rba: [EnumRoles.SUPER_ADMIN,EnumRoles.SUB_ADMIN,EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR],
          items: [
            {
              title: 'Service Units',
              url: AdmindepartmentAndMembersRoute.fullPath,
              rba: [EnumRoles.SUPER_ADMIN,EnumRoles.SUB_ADMIN,EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
            },
            {
              title: 'Attendance Overview',
              url: departmentAttendaceRoute.fullPath,
              rba: [EnumRoles.SUPER_ADMIN,EnumRoles.SUB_ADMIN,EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]            }
          ]
        }
      ]
    },
    {
      title: 'Others',
      items: [
        {
          title: 'Settings',
          icon: SettingsIcon,
          rba: [],
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
              rba: []
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
              rba: []
            }
          ]
        }
      ]
    }
  ]
};
