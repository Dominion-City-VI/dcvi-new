import { IconLayoutDashboard, IconTool, IconUserCog } from '@tabler/icons-react';
import { type SidebarData } from '../types';
import { EnumRoles } from '@/constants/mangle';
import {
  GitPullRequestArrow,
  MessageSquare,
  SettingsIcon,
  TableCellsMerge,
  Users,
  Wallet2,
  ShieldCheck,
  BarChart3,
  ShieldOff,
  Mail
} from 'lucide-react';

export const sidebarData: SidebarData = {
  roleSwitcher: [
    { name: 'Admin', value: EnumRoles.SUPER_ADMIN },
    { name: 'Sub Admin', value: EnumRoles.SUB_ADMIN },
    { name: 'Senior Pastor', value: EnumRoles.SENIOR_PASTOR },
    { name: 'Pastor', value: EnumRoles.PASTOR },
    { name: 'District Pastor', value: EnumRoles.DISTRICT_PASTOR },
    { name: 'Zonal Pastor', value: EnumRoles.ZONAL_PASTOR },
    { name: 'Cell Leader', value: EnumRoles.CELL_LEADER },
    { name: 'Asst. cell leader', value: EnumRoles.ASST_CELL_LEADER },
    { name: 'Member', value: EnumRoles.MEMBER },
    { name: 'Departmental Head', value: EnumRoles.DEPARTMENTAL_HEAD },
    { name: 'Asst. dept. head', value: EnumRoles.ASST_DEPARTMENTAL_HEAD }
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
          rba: []
        },
        {
          title: 'Messaging',
          icon: MessageSquare,
          rba: [],
          items: [
            { title: 'SMS', url: '/messaging/sms', rba: [] },
            { title: 'Phone book', url: '/messaging/phone-book', rba: [] }
          ]
        },
        {
          title: 'Wallet',
          url: '/wallet',
          icon: Wallet2,
          rba: []
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Manage Cell',
          icon: TableCellsMerge,
          rba: [EnumRoles.CELL_LEADER, EnumRoles.ASST_CELL_LEADER],
          items: [
            { title: 'Members', url: '/cell/members', rba: [] },
            { title: 'Attendance', url: '/cell/attendance', rba: [] }
          ]
        },
        {
          title: 'Manage Zone',
          icon: TableCellsMerge,
          rba: [EnumRoles.ZONAL_PASTOR],
          items: [
            { title: 'Zone', url: '/zone/cells', rba: [] },
            { title: 'Attendance', url: '/zone/attendance', rba: [] }
          ]
        },
        {
          title: 'Users',
          icon: Users,
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN],
          url: '/admin/users'
        },
        {
          title: 'Requests',
          icon: GitPullRequestArrow,
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN],
          items: [
            {
              title: 'Access',
              url: '/admin/requests/access',
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN]
            },
            {
              title: 'Actions',
              url: '/admin/requests/actions',
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN]
            }
          ]
        },
        {
          title: 'Manage Zone',
          icon: TableCellsMerge,
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR],
          items: [
            {
              title: 'Zone',
              url: '/admin/zones',
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
            },
            {
              title: 'Attendance',
              url: '/admin/zones/attendance',
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
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
              url: '/department/departmentMembers',
              rba: [EnumRoles.DEPARTMENTAL_HEAD, EnumRoles.ASST_DEPARTMENTAL_HEAD]
            },
            {
              title: 'Attendance',
              url: '/department/deptAttendance',
              rba: [EnumRoles.DEPARTMENTAL_HEAD, EnumRoles.ASST_DEPARTMENTAL_HEAD]
            }
          ]
        },
        {
          title: 'Manage Department',
          icon: TableCellsMerge,
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR],
          items: [
            {
              title: 'Service Units',
              url: '/admin/departments',
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
            },
            {
              title: 'Attendance Overview',
              url: '/admin/departments/attendance',
              rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
            }
          ]
        },
        {
          title: 'Leaders',
          icon: ShieldCheck,
          url: '/admin/leaders',
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
        },
        {
          title: 'Analytics',
          icon: BarChart3,
          url: '/admin/analytics',
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
        },
        {
          title: 'Restrictions',
          icon: ShieldOff,
          url: '/admin/restrictions',
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
        },
        {
          title: 'Email',
          icon: Mail,
          url: '/admin/email',
          rba: [EnumRoles.SUPER_ADMIN, EnumRoles.SUB_ADMIN, EnumRoles.PASTOR, EnumRoles.SENIOR_PASTOR]
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
            { title: 'Profile', url: '/settings', icon: IconUserCog, rba: [] },
            { title: 'Account', url: '/settings/account', icon: IconTool, rba: [] }
          ]
        }
      ]
    }
  ]
};
