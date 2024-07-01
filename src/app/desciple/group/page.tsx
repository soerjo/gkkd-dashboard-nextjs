'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DataTable } from './_components/table'

export default function Dashboard() {
  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Desciples Group
        </h1>
      </div>
      <DataTable />

    </>
  )
}