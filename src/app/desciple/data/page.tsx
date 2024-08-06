'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllTableChurchQuery } from '@/store/services/church'
import { useLazyGetAllListQuery } from '@/store/services/disciples'
import { useLazyGetAllQuery } from '@/store/services/disciples-group'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [lazyRegion] = useLazyGetAllTableChurchQuery();
  const fetchRegion = async (query: string) => {
    try {
      const res = await lazyRegion({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  const [lazyParent] = useLazyGetAllListQuery();
  const fetchParent = async (query: string) => {
    try {
      const res = await lazyParent({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  const [lazyGroup] = useLazyGetAllListQuery();
  const fetchGroup = async (query: string) => {
    try {
      const res = await lazyGroup({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Disciples
        </h1>
        <MyBreadcrum currentPath='list' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <MyDrawer DrawerForm={CreateForm}>
          <Button variant="outline" size="sm" className="flex gap-2">
            <PlusIcon className="size-4" aria-hidden="true" />
            {isDesktop && "New Disciple"}
          </Button>
        </MyDrawer>

        {/* <Button variant="outline" size="sm" className="flex gap-2">
          <DownloadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Export"}
        </Button>
        <Button variant="outline" size="sm" className="flex gap-2">
          <UploadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Import"}
        </Button> */}
      </div>
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSearchInput />
        <CustomSelect compName={'church'} fetchQuery={fetchRegion} />
        <CustomSelect compName={'pembimbing'} fetchQuery={fetchParent} />
        <CustomSelect compName={'group'} fetchQuery={fetchGroup} />
        {/* <DateRangePicker /> */}
      </div>
      <DataTable />

    </>
  )
}