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
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Blesscomn',
    label: '',
    href: '',
    icon: <IconUsersGroup size={18} />,
    sub: [
      {
        title: 'Report',
        label: '',
        href: '/blesscomn/report',
        icon: <IconDatabaseExport size={18} />,
      },
      {
        title: 'Data',
        label: '',
        href: '/blesscomn/data',
        icon: <IconReportSearch size={18} />,
      },
    ],
  },
  {
    title: 'Sunday Service',
    label: '',
    href: '',
    icon: <IconBible size={18} />,
    sub: [
      {
        title: 'Report',
        label: '',
        href: '/sunday-service/report',
        icon: <IconDatabaseExport size={18} />,
      },
      {
        title: 'Data',
        label: '',
        href: '/sunday-service/data',
        icon: <IconReportSearch size={18} />,
      },
    ],
  },
  {
    title: 'Desciples',
    label: '',
    href: '',
    icon: <IconUsers size={18} />,
    sub: [
      {
        title: 'Report',
        label: '',
        href: '/desciple/report',
        icon: <IconDatabaseExport size={18} />,
      },
      {
        title: 'Data',
        label: '',
        href: '/desciple/data',
        icon: <IconReportSearch size={18} />,
      },
    ],
  },
  {
    title: 'Users',
    label: '',
    href: '/user',
    icon: <IconUserHexagon size={18} />,
  },
  {
    title: 'Members',
    label: '',
    href: '/member',
    icon: <IconUserSquare size={18} />,
  },
  {
    title: 'Church',
    label: '',
    href: '/church',
    icon: <IconBuildingChurch size={18} />,
  },
  {
    title: 'Article',
    label: '',
    href: '/article',
    icon: <IconNotebook size={18} />,
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
