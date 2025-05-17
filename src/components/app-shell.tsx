'use client'

import React from 'react'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Button } from './custom/button'
import { MyNewNavbar } from './navbar'


export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const authData = useSelector((state: RootState) => state.auth)

  return (
    <>
      <MyNewNavbar />
      <div className='relative h-full overflow-hidden bg-background'>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          id='content'
          className={`overflow-x-hidden transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
        >
          {/* <div className='min-h-screen'> */}
            <div className='container mx-auto space-y-4 md:px-8 px-4 py-8'>
              {
                !authData.isPhoneValidate && (
                  <Alert className='flex flex-row justify-between items-center'>
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
            </div>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}
