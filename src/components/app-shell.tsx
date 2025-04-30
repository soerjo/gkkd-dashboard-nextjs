'use client'

import React from 'react'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Button } from './custom/button'


export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const authData = useSelector((state: RootState) => state.auth)

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

          <LayoutBody className='container mx-auto space-y-4'>
            {
              !authData.isPhoneValidate && (
                <Alert className='flex flex-row justify-between items-center'>
                  {/* <Terminal className="h-4 w-4" /> */}
                  <div>
                    <AlertTitle>Linked!</AlertTitle>
                    <AlertDescription>
                      linked you telegram to get notification and updated information.
                    </AlertDescription>
                  </div>
                  <Link href="https://t.me/EgerejaBot" target="_blank">
                    <Button size={'sm'}>
                      Link Telegram
                    </Button>
                  </Link>
                </Alert>
              )
            }
            {children}
          </LayoutBody>
        </Layout>
      </div>
    </div>
  )
}
