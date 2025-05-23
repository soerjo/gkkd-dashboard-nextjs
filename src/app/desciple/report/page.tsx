'use client'

import { DataTable } from './_components/table'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useLazyGetAllTableChurchQuery } from '@/store/services/church'
import { useLazyGetAllListQuery } from '@/store/services/disciples';
import { useLazyGetExportQuery } from '../../../store/services/disciples-report';
import React from 'react';
import { toast } from "react-toastify";
import { getErroMessage } from '../../../lib/rtk-error-validation';
import { saveAs } from 'file-saver'
import { UploadWrapper } from './_components/upload';
import { useLazyGetAllQuery } from '../../../store/services/disciples-group';


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

  const [lazyParent,] = useLazyGetAllListQuery();
  const fetchParent = async (query: string) => {
    try {
      const res = await lazyParent({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data.nim }))
    } catch (error) {
      return []
    }
  }


  const [fetchExport] = useLazyGetExportQuery()
  const handleExport = async () => {
    try {
      const data = await fetchExport({}).unwrap()
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = 'report.xlsx';
      saveAs(blob, fileName);

    } catch (error) {
      console.log({ error })
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
    }
  }


  const [lazyGroup] = useLazyGetAllQuery();
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
          discipleship Reports
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

        <Button variant="outline" size="sm" className="flex gap-2" onClick={handleExport}>
          <DownloadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Export"}
        </Button>


        <UploadWrapper>
          <Button variant="outline" size="sm" className="flex gap-2">
            <UploadIcon className="size-4" aria-hidden="true" />
            {isDesktop && "Import"}
          </Button>
        </UploadWrapper>

      </div>
      <CustomSearchInput />
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSelect compName={'pembimbing'} fetchQuery={fetchParent} />
        <CustomSelect compName={'church'} fetchQuery={fetchRegion} />
        <CustomSelect compName={'group'} fetchQuery={fetchGroup} />
        <DateRangePicker />
      </div>
      <DataTable />

    </>
  )
}