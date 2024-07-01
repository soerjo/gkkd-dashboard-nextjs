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
        title: 'Blesscomn',
        label: '',
        href: '/blesscomn/data',
        icon: <IconReportSearch size={18} />,
      },
      // {
      //   title: 'Organization',
      //   label: '',
      //   href: '/blesscomn/data',
      //   icon: <IconReportSearch size={18} />,
      // },
      {
        title: 'Report',
        label: '',
        href: '/blesscomn/report',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },
  {
    title: 'Cermon',
    label: '',
    href: '',
    icon: <IconBible size={18} />,
    sub: [
      {
        title: 'Cermons',
        label: '',
        href: '/event',
        icon: <IconNotebook size={18} />,
      },
      {
        title: 'Report',
        label: '',
        href: '/sunday-service/report',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },
  {
    title: 'Descipleship',
    label: '',
    href: '',
    icon: <IconUsers size={18} />,
    sub: [
      {
        title: 'Disciples',
        label: '',
        href: '/desciple/data',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Group',
        label: '',
        href: '/desciple/group',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Report',
        label: '',
        href: '/desciple/report',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },

  {
    title: 'Members',
    label: '',
    href: '',
    icon: <IconUserSquare size={18} />,
    sub: [
      {
        title: 'Jemaat',
        label: '',
        href: '/member/jemat',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Marital',
        label: '',
        href: '/member/marital',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Batism',
        label: '',
        href: '/member/baptism',
        icon: <IconDatabaseExport size={18} />,
      },
      {
        title: 'Child Dedication',
        label: '',
        href: '/member/penyerahan-anak',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },
  {
    title: 'Management',
    label: '',
    href: '/user',
    icon: <IconUserHexagon size={18} />,
    sub: [
      {
        title: 'user',
        label: '',
        href: '/management/user',
        icon: <IconUserHexagon size={18} />,
      },
      {
        title: 'Region',
        label: '',
        href: '/management/region',
        icon: <IconBuildingChurch size={18} />,
      },
      // {
      //   title: 'Article',
      //   label: '',
      //   href: '/article',
      //   icon: <IconNotebook size={18} />,
      // },
    ]
  },


  // {
  //   title: 'Settings',
  //   label: '',
  //   href: '/settings',
  //   icon: <IconSettings size={18} />,
  // },
]
