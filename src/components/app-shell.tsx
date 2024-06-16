'use client'

import { usePathname } from 'next/navigation'

import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { ThemeProvider } from './theme-provider'

import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'


const topNav = [
  {
    title: 'Report',
    href: 'dashboard/overview',
    isActive: true,
  },
  {
    title: 'Data',
    href: 'dashboard/customers',
    isActive: false,
  },
  {
    title: 'View',
    href: 'dashboard/products',
    isActive: false,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
  },
]

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  // const pathname = usePathname()

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>

      <div className='relative h-full overflow-hidden bg-background'>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          id='content'
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
        >
          <Layout>
            <LayoutHeader>
              {
                // ['/blesscomn', '/sunday-service', '/desciple'].some(v => pathname.includes(v)) &&
                // <TopNav links={topNav} />
              }
              <div className='ml-auto flex items-center space-x-4'>
                <ThemeSwitch />
                <UserNav />
              </div>
            </LayoutHeader>

            <LayoutBody className='space-y-4'>

              {children}
            </LayoutBody>
          </Layout>
        </div>
      </div>
    </ThemeProvider>

  )
}
