import { UserRole } from '@/interfaces/auth.interface'
import {
  IconDatabaseExport,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconBible,
  IconUserHexagon,
  IconUsersGroup,
  IconUserSquare,
  IconBuildingChurch,
  IconNotebook,
  IconReportSearch

} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
  roles?: string[]
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Blesscomn',
    label: '',
    roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
    href: '/blesscomn',
    icon: <IconUsersGroup size={18} />,
    sub: [
      {
        title: 'Blesscomn',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/blesscomn/data',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Report',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/blesscomn/report',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },
  {
    title: 'Cermon',
    label: '',
    roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
    href: '/cermon',
    icon: <IconBible size={18} />,
    sub: [
      {
        title: 'Cermons',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/cermon/data',
        icon: <IconNotebook size={18} />,
      },
      {
        title: 'Report',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/cermon/report',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },
  {
    title: 'Descipleship',
    label: '',
    roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN],
    href: '/desciple',
    icon: <IconUsers size={18} />,
    sub: [
      {
        title: 'Disciples',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN],
        href: '/desciple/data',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Group',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN],
        href: '/desciple/group',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Report',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN],
        href: '/desciple/report',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },

  {
    title: 'Members',
    label: '',
    roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
    href: '/member',
    icon: <IconUserSquare size={18} />,
    sub: [
      {
        title: 'Jemaat',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/member/jemaat',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Marital',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/member/marital',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Baptism',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/member/baptism',
        icon: <IconDatabaseExport size={18} />,
      },
      {
        title: 'Child Dedication',
        label: '',
        roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.ADMIN],
        href: '/member/child-dedication',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },
  {
    title: 'Management',
    label: '',
    roles: [UserRole.SYSTEMADMIN,
    UserRole.SUPERADMIN],
    href: '/management',
    icon: <IconUserHexagon size={18} />,
    sub: [
      {
        title: 'user',
        label: '',
        roles: [UserRole.SYSTEMADMIN,
        UserRole.SUPERADMIN],
        href: '/management/user',
        icon: <IconUserHexagon size={18} />,
      },
      {
        title: 'Region',
        label: '',
        roles: [UserRole.SYSTEMADMIN,
        UserRole.SUPERADMIN],
        href: '/management/region',
        icon: <IconBuildingChurch size={18} />,
      },

    ]
  },
]
