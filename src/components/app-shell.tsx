'use client'

import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Layout className='min-h-screen'>
          <LayoutHeader>
            <div className='ml-auto flex items-center space-x-4 '>
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
  )
}
