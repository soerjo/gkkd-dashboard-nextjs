'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DataTable } from './_components/table'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log({
      from: searchParams.get('from'),
      to: searchParams.get('to')
    })
  }, [searchParams])

  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Baptism
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