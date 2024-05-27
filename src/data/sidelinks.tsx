import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
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
  // {
  //   title: 'Tasks',
  //   label: '3',
  //   href: '/tasks',
  // icon: <IconChecklist size={18} />,
  // },
  // {
  //   title: 'Chats',
  //   label: '9',
  //   href: '/chats',
  // icon: <IconMessages size={18} />,
  // },
  // {
  //   title: 'Apps',
  //   label: '',
  //   href: '/apps',
  // icon: <IconApps size={18} />,
  // },
  {
    title: 'Blesscomn',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'report',
        label: '',
        href: '/blesscomn/report',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'data',
        label: '',
        href: '/blesscomn/data',
        icon: <IconHexagonNumber2 size={18} />,
      },
    ],
  },
  {
    title: 'Sunday Service',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'report',
        label: '',
        href: '/sunday-service/report',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'data',
        label: '',
        href: '/sunday-service/data',
        icon: <IconHexagonNumber2 size={18} />,
      },
    ],
  },
  {
    title: 'Desciples',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'report',
        label: '',
        href: '/desciple/report',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'data',
        label: '',
        href: '/desciple/data',
        icon: <IconHexagonNumber2 size={18} />,
      },
    ],
  },
  {
    title: 'Users',
    label: '',
    href: '/user',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'congregation members',
    label: '',
    href: '/member',
    icon: <IconUsers size={18} />,
  },
  // {
  //   title: 'Requests',
  //   label: '10',
  //   href: '/requests',
  // icon: <IconRouteAltLeft size={18} />,
  //   sub: [
  //     {
  //       title: 'Trucks',
  //       label: '9',
  //       href: '/trucks',
  // icon: <IconTruck size={18} />,
  //     },
  //     {
  //       title: 'Cargos',
  //       label: '',
  // href: '/cargos',
  // icon: <IconBoxSeam size={18} />,
  //     },
  //   ],
  // },
  {
    title: 'church',
    label: '',
    href: '/church',
    icon: <IconChartHistogram size={18} />,
  },
  {
    title: 'Article',
    label: '',
    href: '/article',
    icon: <IconComponents size={18} />,
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
