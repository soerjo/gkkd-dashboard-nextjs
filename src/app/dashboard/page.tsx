'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { RecentSales } from './components/component.recen-data'
import { LineChartComp } from './components/line-chart.component'
import { IconBible, IconUserSquare, IconUsers, IconUsersGroup } from '@tabler/icons-react'

export default function Dashboard() {
  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Dashboard
        </h1>
        {/* <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div> */}
      </div>
      <Tabs
        orientation='vertical'
        defaultValue='overview'
        className='space-y-4'
      >
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Jemaat
                </CardTitle>
                <IconUserSquare size={18} color='currentColor' className='text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>45,231.89</div>
                <p className='text-xs text-muted-foreground'>
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Sunday Service
                </CardTitle>
                <IconBible size={18} color='currentColor' className='text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>2350</div>
                <p className='text-xs text-muted-foreground'>
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Blesscomn
                </CardTitle>
                <IconUsersGroup size={18} color='currentColor' className='text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>12,234</div>
                <p className='text-xs text-muted-foreground'>
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Desciple
                </CardTitle>
                <IconUsers size={18} color='currentColor' className='text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>573</div>
                <p className='text-xs text-muted-foreground'>
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-5'>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <LineChartComp />
              </CardContent>
            </Card>
            {/* <Card className='col-span-1 lg:col-span-2'>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}