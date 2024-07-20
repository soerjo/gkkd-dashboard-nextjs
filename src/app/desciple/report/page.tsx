'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllChurchQuery } from '@/store/services/church'
import { useLazyGetAllQuery } from '@/store/services/fellowship'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [lazyFetchChurch] = useLazyGetAllChurchQuery();
  const [lazyFetchCommunity] = useLazyGetAllQuery();

  const fetchChurch = async (query: string) => {
    try {
      const res = await lazyFetchChurch({ take: 5, page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  const fetchCommunity = async (query: string) => {
    try {
      const res = await lazyFetchCommunity({ take: 5, page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }
  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Discipleship Reports
        </h1>
        <MyBreadcrum currentPath='data' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <MyDrawer DrawerForm={CreateForm}>
          <Button variant="outline" size="sm" className="flex gap-2">
            <PlusIcon className="size-4" aria-hidden="true" />
            {isDesktop && "New Report"}
          </Button>
        </MyDrawer>

        <Button variant="outline" size="sm" className="flex gap-2">
          <DownloadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Export"}
        </Button>

        <Button variant="outline" size="sm" className="flex gap-2">
          <UploadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Import"}
        </Button>

      </div>
      <CustomSearchInput />
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSelect compName={'church'} fetchQuery={fetchChurch} />
        <CustomSelect compName={'community'} fetchQuery={fetchCommunity} />
        <DateRangePicker />
      </div>
      <DataTable />

    </>
  )
}