'use client'

import { Button } from '@/components/custom/button'
import { MyDrawer } from '@/components/my-drawer'
import { DataTable } from '@/components/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconBible, IconUserSquare, IconUsers, IconUsersGroup } from '@tabler/icons-react'

export default function Dashboard() {
  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          User
        </h1>
      </div>
      <DateRangePicker
        triggerSize="sm"
        triggerClassName="ml-auto w-56 sm:w-60"
        align="end"
      />
      <DataTable />

    </>
  )
}