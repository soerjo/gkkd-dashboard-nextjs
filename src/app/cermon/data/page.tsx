'use client'

import { DataTable } from './_components/table'

export default function Dashboard() {
  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Cermon
        </h1>
      </div>
      <DataTable />

    </>
  )
}