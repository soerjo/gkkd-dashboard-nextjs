'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DataTable } from './_components/table'
import { useLazyGetAllChurchQuery } from '@/store/services/church'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [lazy] = useLazyGetAllChurchQuery();
  const fetch = async (query: string) => {
    try {
      const res = await lazy({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }
  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Marital
        </h1>
        <MyBreadcrum currentPath='data' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <MyDrawer DrawerForm={CreateForm}>
          <Button variant="outline" size="sm" className="flex gap-2">
            <PlusIcon className="size-4" aria-hidden="true" />
            {isDesktop && "New Marital"}
          </Button>
        </MyDrawer>

        <Button variant="outline" size="sm" className="flex gap-2">
          <DownloadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Export"}
        </Button>
      </div>
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSearchInput />
        <CustomSelect compName={'church'} fetchQuery={fetch} />
        {/* <DateRangePicker /> */}
      </div>
      <DataTable />

    </>
  )
}