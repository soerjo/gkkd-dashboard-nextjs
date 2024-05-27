'use client'

import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { ThemeProvider } from './theme-provider'

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>

      <div className='relative h-full overflow-hidden bg-background'>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main
          id='content'
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
        >
          {children}
        </main>
      </div>
    </ThemeProvider>

  )
}
